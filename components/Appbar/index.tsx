import Navigation from './Navigation';
import ProfileImage from './ProfileImage';

export default function Appbar() {
  return (
    <nav className='absolute right-0 left-0 bottom-0 w-full border-t-[0.3px]'>
      <ul className='flex w-full justify-around py-3'>
        <Navigation />
        <ProfileImage />
      </ul>
    </nav>
  );
}
