'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getRoleBadgeVariant, getRoleDisplayName } from '@/utils/role';
import { Session } from 'next-auth';

interface CreatePostButtonProps {
  user: Pick<Session['user'], 'nickname' | 'role' | 'image'>;
}

export default function CreatePostButton({ user }: CreatePostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // user가 없을 때의 처리
  if (!user) {
    return <div>user</div>; // 또는 로딩 상태를 보여줄 수 있습니다
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('api/notice', {
        method: 'POST',
        body: JSON.stringify({
          author: user.nickname,
          role: user.role,
          content: formData.get('content'),
          avatarUrl: user.image || '/default-avatar.png',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to create post');
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className='w-full bg-blue-500 hover:bg-blue-600 text-white'
      >
        공지 올리기
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>새 공지사항 작성</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex items-center gap-3'>
              <Label>작성자</Label>
              <p className='text-gray-700'>{user.nickname}</p>
            </div>
            <div className='flex items-center gap-3'>
              <Label>직급</Label>
              <div>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='content'>내용</Label>
              <Textarea id='content' name='content' required rows={10} />
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </Button>
              <Button type='submit'>작성하기</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
