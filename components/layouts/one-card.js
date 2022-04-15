export default function OneCard({ children, className }) {
  return <>
    <div className='min-h-screen px-4 py-8 bg-slate-100 flex justify-center items-center'>
      <div className={`bg-white rounded-md w-full max-w-screen-xl shadow-md overflow-hidden ${className && className}`}>
        {children}
      </div>
    </div>
  </>
}