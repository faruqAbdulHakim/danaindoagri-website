export default function ReviewList({ reviewList }) {
  return <>
    {
      reviewList.map((Review) => {
        return <div key={Review.id} className='border shadow-md items-center rounded-md mb-3 
          flex gap-8 p-4'>
          <p className='w-36 overflow-clip'>
            {Review.users.fullName}
          </p>
          <p>
            {Review.review}
          </p>
        </div>
      })
    }
  </>
}