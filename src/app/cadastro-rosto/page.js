"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { API_Post } from "../../services/api/API_Post"

import Webcam from "react-webcam"
import { useFaceDetection } from "react-use-face-detection"
import FaceDetection from '@mediapipe/face_detection'
import { Camera } from '@mediapipe/camera_utils'
import React from "react"

import Cookies from 'js-cookie'

import Header from "../../components/Header"
import PopupMessage from "../../components/PopupMessage"
import PhotoButton from "../../components/PhotoButton"
import NavigationButton from "../../components/NavigationButton"

import { AiOutlineLoading } from 'react-icons/ai';
import { TbFaceId, TbFaceIdError, TbReload, TbDownload } from 'react-icons/tb';
import { BsPerson, BsPersonCheck } from 'react-icons/bs'


export default function CadastroRosto() {

  const route = useRouter()


  const [camVideo, setCamVideo] = useState({
    isVideo: null,
    error: false,
    status: 'Carregando'
  })

  const [photoLink, setPhotoLink] = useState('')

  const [cardPhoto, setCardPhoto] = useState({
    photo: null,
    name: null,
    status: null
  })

  const [message, setMessage] = useState({
    enabled: false,
    error: false,
    description: ''
  })

  const [hasPhoto, setHasPhoto] = useState(false)

  const [disableAll, setDisableAll] = useState(false)
  const [disableSend, setDisableSend] = useState(false)
  const [loading, setLoading] = useState(true)

  const [downloadFileName, setDownloadFileName] = useState('')

  let cropPosition = {
    xCenter: 0,
    yCenter: 0,
    width: 0,
    height: 0
  }


  const photoRef = useRef(null)

  const width = 500;
  const height = 500;

  const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    // mirrored: true,
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  })


  useEffect(() => {
    getVideo()
  }, [webcamRef])



  function getVideo() {
    navigator.mediaDevices
      ?.getUserMedia({
        video: { width: 1920, height: 1080 }
      })
      .then(stream => {
        let video = videoRef.current
        video.srcObject = stream
        video.play()
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
      })

  }



  const [timerPhotoInterval, setTimerPhotoInterval] = useState(null);
  const [counter, setCounter] = useState('');


  const tipMessages = [
    "Evite se mover",
    "Não cubra o rosto",
    "Não utilize máscara",
    "Evite utilizar óculos",
    "Confira o foco",
  ]

  const [tipMessage, setTipMessage] = useState({
    active: true,
    message: tipMessages[tipMessages.length - 1],
    counter: 0
  })

  const defaultTimer = 3

  const setTakePhotoTimer = () => {
    let timer = defaultTimer;

    if (timerPhotoInterval) {
      if (!detected || facesDetected !== 1 || hasPhoto || boundingBox.length !== 1) {
        clearInterval(timerPhotoInterval);
        setTimerPhotoInterval(null);
        setCounter(defaultTimer)
        setDisableAll(false)
      }
    }
    if (detected && facesDetected === 1 && !hasPhoto && boundingBox.length === 1) {
      if (!timerPhotoInterval) {
        setDisableAll(true)
        const interval = setInterval(() => {
          timer = timer - 1;
          setCounter(timer)
          if (timer <= 0) {
            clearInterval(interval);
            setTimerPhotoInterval(null);
            takePhoto();
          }
        }, 1000);
        setTimerPhotoInterval(interval);
      }
    }
  }

  useEffect(() => {
    if (!isLoading) {
      setTakePhotoTimer();
    }
  }, [detected, hasPhoto, facesDetected, boundingBox]);

  useEffect(() => {

    let counter = 0
    var interval = setInterval(() => {
      setTipMessage({
        active: true,
        message: tipMessages[counter],
        counter: counter
      })
      counter++

      if (counter > tipMessages.length - 1) {
        counter = 0
      }
    }, 4000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setTipMessage({
      active: false,
      message: tipMessage.message,
      counter: tipMessage.counter
    })
    const timer = setTimeout(() => {
      setTipMessage({
        active: true,
        message: tipMessage.message,
        counter: tipMessage.counter

      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [tipMessage.message])

  const takePhoto = async () => {
    setHasPhoto(false)

    setMessage({
      enabled: true,
      error: false,
      description: 'Processando'
    })

    setCardPhoto({
      photo: 'null',
      name: null,
      status: 'Processando foto'
    })

    let video = webcamRef.current.video
    let canvas = photoRef.current

    const width = webcamRef.current.video.videoWidth
    const height = webcamRef.current.video.videoHeight

    canvas.width = width
    canvas.height = height


    let ctx = canvas.getContext('2d')

    const scale = 1

    let startX = (width * (cropPosition.xCenter)) / scale
    let startY = (width * (cropPosition.yCenter)) / scale
    let sizeWidth = width * (cropPosition.width) * scale
    let sizeHeight = height * (cropPosition.width) * scale


    ctx.drawImage(video, startX, startY, sizeWidth, sizeHeight, 0, 0, canvas.width, canvas.height)

    // ctx.drawImage(video, 0, 0)

    // let actualPhoto = photoRef.current.toDataURL()
    let actualPhoto = photoRef.current.toDataURL().replace('data:', '').replace(/^.+,/, '')

    setPhotoLink(photoRef.current.toDataURL())

    const imageSrc = actualPhoto
    // const imageSrc = webcamRef.current.getScreenshot()

    // setCardPhoto({
    //   error: false,
    //   photo: actualPhoto,
    //   name: cadastro.name,
    //   status: null
    // })

    setLoading(false)
    clearInterval(timerPhotoInterval);
    setTimerPhotoInterval(null);
    setCounter(defaultTimer)

    // setDisableAll(true)
    // setDisableSend(true)
    setHasPhoto(true)

    // postCropPhoto(cadastro.name, cadastro.cpf, imageSrc, true)

  }

  const postCropPhoto = async (name, cpf, imageSrc, tryAgain) => {
    const postImage = await API_Post('/api/recortarfoto', { cpf: cpf, base64_rosto: imageSrc })
    if (postImage.ok) {

      if (postImage.data === "rosto não encontrado") {
        setCardPhoto({
          error: true,
          photo: 'null',
          name: name,
          status: "Rosto não encontrado",
        })
        setMessage({
          enabled: true,
          error: true,
          description: "Rosto não encontrado"
        })
      } else if (postImage.data === "" && tryAgain == true) {
        postCropPhoto(name, cpf, imageSrc, false)
      } else if (postImage.data === "") {
        setMessage({
          enabled: true,
          error: true,
          description: "Não foi possível processar a foto, tente novamente!"
        })

      } else {
        setCardPhoto({
          error: false,
          photo: postImage.data,
          name: name,
          status: null
        })

        setMessage({
          enabled: false,
          error: false,
          description: ""
        })

        setHasPhoto(true)
        setDisableSend(false)
        setPhotoLink(postImage.data)
      }
    } else {
      setCardPhoto({
        error: true,
        photo: "null",
        name: name,
        status: `Não foi possível processar a foto, tente novamente! (${postImage.title})`,
      })
      setMessage({
        enabled: true,
        error: true,
        description: `Não foi possível processar a foto, tente novamente! (${postImage.title})`
      })

    }
    setDisableAll(false)
    setLoading(false)

  }

  const tryAgain = () => {
    setCardPhoto({
      photo: null,
      name: null,
    })

    setMessage({
      enabled: false,
      error: false,
      description: ''
    })
    setHasPhoto(false)
  }

  const getDateTime = () => {
    const today = new Date()
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    const time = `${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`
    const dateTime = `${date}-${time}`
    return dateTime
  }

  return (
    <>
      <Header back="/"></Header>
      <main className="flex flex-col justify-start items-center gap-5 w-full h-screen px-3 max-w-2xl m-auto">

        <div className="mt-40 mb-48 h-full flex flex-col items-center justify-center">

          {
            isLoading &&
            <div className="text-3xl text-center mt-10 text-usgmathe">
              <AiOutlineLoading size={70} className="py-4 m-auto text-usgmathe animate-spin" />
              <p className={`animate-pulse ${message.error && 'text-pormade-red'}`}>
                Carregando
              </p>
            </div>
          }
          {
            !message.error && !isLoading &&
            <>
              <div className="text-center mb-10">
                <div className="text-4xl ">
                  {
                    hasPhoto && !loading && !message.error ?
                      <BsPersonCheck className="text-center m-auto text-6xl" />
                      :
                      <BsPerson className="text-center m-auto text-6xl" />
                  }
                  <h1 className="font-extrabold">
                    {cardPhoto.photo ? 'Verifique sua foto' : 'Tire uma foto'}
                  </h1>
                </div>
                {cardPhoto.photo &&
                  <>
                    <p className="text-center text-xl font-medium mt-2">Confira se a foto ficou corretamente enquadrada.</p>
                    <p className="text-center text-lg font-medium text-gray-500">Se necessário, toque em "Tentar novamente"!</p>

                  </>
                }
              </div>
            </>
          }



          <div className="flex flex-col items-center justify-center w-full">
            <div className={`${hasPhoto | isLoading && 'hidden'} overflow-hidden`}>
              <div style={{ width, height, position: 'relative' }} className="-scale-x-100">
                {
                  facesDetected == 1 &&
                  <PhotoButton takePhoto={takePhoto} />
                }
                {boundingBox.map((box, index) => {
                  cropPosition = {
                    yCenter: box.yCenter,
                    xCenter: box.xCenter,
                    width: box.width,
                    height: box.height
                  }
                  return (

                    <div
                      key={`${index + 1}`}
                      className={`border-[3px] border-solid absolute rounded-sm   ${index > 0 ? 'border-pormade-red' : 'border-usgmathe'}`}
                      style={{
                        top: `${box.yCenter * 100}%`,
                        left: `${box.xCenter * 100}%`,
                        width: `${box.width * 100}%`,
                        height: `${box.height * 100}%`,
                        zIndex: 1,
                      }}
                    >
                    </div>
                  )
                })}


                <PopupMessage condition={facesDetected > 1} error={true} className={'-scale-x-100'}>
                  Somente uma pessoa!
                </PopupMessage>

                <PopupMessage condition={tipMessage.active && facesDetected == 1} className={'-scale-x-100'}>
                  {tipMessage.active && tipMessage.message}
                </PopupMessage>


                {
                  camVideo.isVideo &&
                  <>
                    <div className={`${facesDetected <= 0 ? 'opacity-100' : 'opacity-0'} absolute flex flex-col items-center justify-center w-full h-full rounded-xl z-40  backdrop-blur-md backdrop-brightness-50 transition-all duration-500 -scale-x-100 `}>
                      <div className={`z-50 text-5xl text-center text-white animate-pulse-3s  `}>
                        {
                          facesDetected <= 0 ?
                            <>
                              <TbFaceIdError className=" text-white text-7xl text-center m-auto" />
                              <p className="mt-5">Buscando rosto</p>
                            </>
                            :
                            <>

                              <TbFaceId className=" text-white text-7xl text-center m-auto" />
                              <p className="mt-5">Rosto encontrado</p>
                            </>
                        }
                      </div>
                    </div>
                  </>
                }



                <Webcam className="rounded-xl absolute"
                  ref={webcamRef}
                  forceScreenshotSourceSize
                  onUserMedia={() => setCamVideo({ isVideo: true, status: 'Carregado' })}
                  onUserMediaError={(e) => setCamVideo({ isVideo: null, status: e.message, error: true })}
                  screenshotFormat='image/jpeg'
                />

                <p className="absolute bottom-10  w-full text-center text-7xl animate-bounce text-white scale-x-[-1]">
                  <span className="inline-block scale-x-[-1]">
                    {timerPhotoInterval && counter}
                  </span>
                </p>
              </div>
            </div>
            <div className={`${message.error && 'w-0 h-0'} ${hasPhoto && 'rounded-full'} w-full rounded-2xl shadow-2xl shadow-usgmathe/80 mb-10`}>
              <canvas className={`w-full rounded-md outline-4 ${!hasPhoto ? 'hidden' : 'scale-100 outline outline-usgmathe'} p-1 transition-all duration-500`} ref={photoRef}>
              </canvas>



            </div>
            {
              message.error &&
              <div className={`text-3xl text-center mt-10 text-usgmathe `}>
                <p className={`animate-pulse ${message.error && 'text-pormade-red'}`}>{message.description}</p>
              </div>
            }

            {
              hasPhoto && !loading &&

              <div className="fixed flex bottom-0 w-full justify-between items-center z-50 p-7 bg-usgmathe/20 backdrop-blur-[2px]">
                <NavigationButton className={`${message.error && 'm-auto'}`} icon={<TbReload className="-scale-x-100" />} reverse onClick={_ => tryAgain()}>
                  <p className={`hidden sm:block`}>Tentar novamente</p>
                </NavigationButton>
                {
                  !message.error &&
                  <a href={photoLink} download={downloadFileName}>

                    <NavigationButton icon={<TbDownload />} disabled={disableSend || message.error} onClick={_ => {
                      setDisableAll()
                      setDownloadFileName(`face_cropper-${getDateTime()}.png`)
                      // route.push('/cadastro-documento')
                    }}>
                      <p className={`hidden sm:block`}>Download</p>
                    </NavigationButton>
                  </a>
                }
              </div>
            }
          </div>
        </div>
      </main>
    </>
  )
}