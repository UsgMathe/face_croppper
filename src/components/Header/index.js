"use client"

import Link from "next/link"
import Cookies from 'js-cookie'
import { FaArrowLeft } from 'react-icons/fa'

export default function Header({ children, back, disabled, error = false }) {


  return (
    <>

      <div className="fixed w-full z-50">
        <header className="flex flex-col bg-usgmathe justify-center items-center h-16">
          <Link className="text-sm absolute left-3" href={back ? back : ''}>
            {back && <FaArrowLeft className="text-2xl" />}
          </Link>
          face_cropper by usgmathe

        </header>
      </div>
    </>

  )
}