type EmptyBoxProps = {
  message: string;
  subMessage?: string;
  className?: string;
  size?: number;
};

export default function EmptyBox({
  message,
  subMessage,
  className = '',
  size = 200,
}: EmptyBoxProps) {
  return (
    <div
      className={`text-center space-y-4 flex flex-col items-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox='0 0 200 200'
        xmlns='http://www.w3.org/2000/svg'
      >
        <polygon points='50,100 50,150 100,180 100,130' fill='#C0A16B' />
        <polygon points='100,130 100,180 150,150 150,100' fill='#D1B17C' />
        <polygon points='50,100 100,70 150,100 100,130' fill='#E0C28C' />
      </svg>

      <div className='space-y-1'>
        <p className='text-gray-500 font-medium'>{message}</p>
        {subMessage && <p className='text-sm text-gray-400'>{subMessage}</p>}
      </div>
    </div>
  );
}
