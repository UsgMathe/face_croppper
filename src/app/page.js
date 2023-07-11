"use client"

import Header from '../components/Header'
import '../app/globals.css'
import Link from "next/link"
import Button from '../components/Button'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

import { API_Delete } from '../services/api/API_Delete'

import { TbFaceId } from 'react-icons/tb'

export default function Home() {

  const [cpf, setCpf] = useState('')

  useEffect(() => {
    resetCookies()
  }, [])

  const resetCookies = () => {
    const allCookies = Object.keys(Cookies.get())
    allCookies.forEach(cookie => {
      Cookies.remove(cookie)
    })
  }

  return (
    <>
      <Header>face_cropper by usgmathe</Header>
      <main className="flex flex-col justify-center items-center gap-20 w-full h-screen pt-24 px-3 max-w-2xl m-auto">
        <div className="text-center">
          <TbFaceId className="m-auto text-9xl mb-5" />
          <h1 className="text-6xl font-semibold">
            face_cropper
          </h1>
        </div>
        <div className='flex flex-col gap-5'>
          <Link href='/cadastro-rosto' className="w-full flex justify-center">
            <Button onClick={() => resetCookies()}>
              Iniciar
            </Button>
          </Link>

        </div>
      </main>
    </>
  )
}
