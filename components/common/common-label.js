export default function CommonLabel({id, text}) {
  return <>
    <label className='text-slate-400 block mb-2' htmlFor={id}>{text}</label>
  </>
}