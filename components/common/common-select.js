export default function CommonSelect({ children, ...props }) {
  return <>
    <select
      className='rounded-md px-4 py-3 min-w-0 font-semibold placeholder:font-normal bg-slate-50 outline-0
      ring-2 ring-slate-200 focus:ring-slate-600
      transition-all duration-200' 
      {...props}
    >
      {children} 
    </select>
  </>
}