import { FC } from "react"

type EmptyStateProp = {
  message: string
}

const EmptyState: FC<EmptyStateProp> = (props) => {
  const {message} = props
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className='flex justify-center p-8  size-3/4 h-96 bg-violet-100 rounded'>
       <div className="text-black content-center">{message}</div>
      </div>
    </div>
  )
}

export default EmptyState