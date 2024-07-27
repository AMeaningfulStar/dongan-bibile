'use client'

import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { EmailValidationStatus } from '@/libs/emailValidationStatus'
import { auth, firestore } from '@/libs/firebase'
import useSignUpStore from '@/stores/SignUpStore'

import ARROWUP_ICON from '@icon/arrowup_icon.svg'
import SIGNUP_BACKGROUND from '@image/Signup_Background.svg'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function SignUp() {
  const {
    signUpValue,
    setUseName,
    setUseEmail,
    setUsePassword,
    setUseVerifyPassword,
    setUsePhoneNum,
    setUsePosition,
    setUseGrade,
    setUseClass,
    checkPasswordsLength,
    checkPasswordsMatch,
    validateSignUpValue,
  } = useSignUpStore()
  const [isShowDrop, setIsShowDrop] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isCheckPasswordMatch, setIsCheckPasswordMatch] = useState<boolean>(false)
  const [isCheckPasswordLength, setIsCheckPasswordLength] = useState<boolean>(false)
  const [isEmailValidation, setIsEmailValidation] = useState<EmailValidationStatus>(EmailValidationStatus.Default)

  // 이메일 중복 확인
  const checkForDuplicateEmail = async () => {
    try {
      const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i

      // 이메일 형식 검사
      if (!emailRegEx.test(signUpValue.useEmail)) {
        setIsEmailValidation(EmailValidationStatus.InvalidFormat)

        setTimeout(() => setIsEmailValidation(EmailValidationStatus.Default), 3000)

        return
      }

      const result = query(collection(firestore, 'users'), where('email', '==', signUpValue.useEmail))

      const querySnapshot = await getDocs(result)

      if (!querySnapshot.empty) {
        setIsEmailValidation(EmailValidationStatus.Error)

        setTimeout(() => setIsEmailValidation(EmailValidationStatus.Default), 3000)

        return
      }

      setIsEmailValidation(EmailValidationStatus.Success)
    } catch (error) {
      console.log(error)
    }
  }

  // 학년&반 set
  const setUserGradeAndClass = (gradeNum: number, classNum: number) => {
    setUseGrade(gradeNum)
    setUseClass(classNum)

    setIsShowDrop(!isShowDrop)
  }

  // 회원가입 function
  const handleOnSunbmit = async () => {
    const error = validateSignUpValue()

    if (error.isError) {
      setErrorMessage(error.errorMessage)
    } else if (isEmailValidation !== EmailValidationStatus.Success) {
      setErrorMessage('email 중복 확인해주세요')
    } else {
      createUserWithEmailAndPassword(auth, signUpValue.useEmail, signUpValue.usePassword).then(
        async (userCredential) => {
          await setDoc(doc(firestore, 'users', userCredential.user.uid), {
            name: signUpValue.useName,
            email: signUpValue.useEmail,
            phoneNum: signUpValue.usePhoneNum,
            position: signUpValue.usePosition,
            grade: signUpValue.useGrade,
            class: signUpValue.useClass,
          })
        },
      )
    }
  }

  useEffect(() => {
    setIsCheckPasswordMatch(checkPasswordsMatch())
  }, [signUpValue.useVerifyPassword])

  useEffect(() => {
    setIsCheckPasswordLength(checkPasswordsLength())
  }, [signUpValue.usePassword])

  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-black">
      <Image alt="backbround image" src={SIGNUP_BACKGROUND} className="mb-2.5" />
      <div className="absolute h-full w-full px-3 pb-9 pt-12">
        <div className="flex h-full w-full flex-col items-center rounded-xl bg-white bg-opacity-50 p-2">
          <div className="px-5 py-2">
            <span className="text-2xl font-semibold leading-none text-white">회원가입</span>
          </div>
          <div className="flex w-full flex-grow flex-col justify-between gap-y-4 overflow-scroll rounded-xl bg-white bg-opacity-70 p-2">
            <div className="flex flex-col gap-y-1">
              <label htmlFor="name" className="ml-1 text-base font-light">
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="이름 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUseName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-2">
                <label htmlFor="email" className="ml-1 text-base font-light">
                  Email
                </label>
                {isEmailValidation === EmailValidationStatus.Error && (
                  <span className="text-sm leading-none text-red-500">이미 존재하는 Email 입니다.</span>
                )}
                {isEmailValidation === EmailValidationStatus.InvalidFormat && (
                  <span className="text-sm leading-none text-red-500">올바른 Email 형식이 아닙니다.</span>
                )}
                {isEmailValidation === EmailValidationStatus.Success && (
                  <span className="text-sm leading-none text-green-500">사용 가능한 Email 입니다.</span>
                )}
              </div>
              <div className="flex gap-x-2">
                <input
                  id="email"
                  type="email"
                  placeholder="이메일 입력해주세요"
                  className="flex-grow p-1 text-base outline-none"
                  value={signUpValue.useEmail}
                  onChange={(event) => setUseEmail(event.target.value)}
                />
                <button
                  className="h-8 w-24 rounded-lg bg-white active:bg-gray-400 active:text-white"
                  onClick={async () => checkForDuplicateEmail()}
                >
                  <span className="text-sm font-normal leading-none">중복확인</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-2">
                <label htmlFor="password" className="ml-1 text-base font-light">
                  비밀번호 (최소 8자 이상)
                </label>
                {!isCheckPasswordLength && signUpValue.usePassword && (
                  <span className="text-sm leading-none text-red-500">최소 8자 이상이어야 합니다.</span>
                )}
              </div>
              <input
                id="password"
                type="password"
                placeholder="비밀번호 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUsePassword(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-2">
                <label htmlFor="verify_password" className="ml-1 text-base font-light">
                  비밀번호 확인
                </label>
                {!isCheckPasswordMatch && signUpValue.useVerifyPassword && (
                  <span className="text-sm leading-none text-red-500">비밀번호가 다릅니다.</span>
                )}
              </div>
              <input
                id="verify_password"
                type="password"
                placeholder="비밀번호 확인 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUseVerifyPassword(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="phoneNum" className="ml-1 text-base font-light">
                전화번호
              </label>
              <input
                id="phoneNum"
                type="number"
                placeholder="전화번호 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUsePhoneNum(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="position" className="ml-1 text-base font-light">
                직분
              </label>
              <div className="flex flex-grow justify-between gap-x-4">
                <button
                  className={twMerge(
                    'flex-grow rounded-lg border-2 border-transparent bg-white py-2',
                    signUpValue.usePosition === 'teacher' && 'border-2 border-blue-500 bg-blue-100',
                  )}
                  onClick={() => setUsePosition('teacher')}
                >
                  교사
                </button>
                <button
                  className={twMerge(
                    'flex-grow rounded-lg border-2 border-transparent bg-white py-2',
                    signUpValue.usePosition === 'student' && 'border-2 border-blue-500 bg-blue-100',
                  )}
                  onClick={() => setUsePosition('student')}
                >
                  학생
                </button>
              </div>
            </div>
            <div className="relative flex flex-col gap-y-1">
              <label htmlFor="affiliation" className="ml-1 text-base font-light">
                소속
              </label>
              <button
                className={twMerge(
                  'flex items-center justify-between rounded-lg px-5 py-2 text-center text-sm font-medium',
                  isShowDrop ? 'bg-blue-100' : 'bg-white',
                )}
                type="button"
                id="affiliation"
                onClick={() => setIsShowDrop(!isShowDrop)}
              >
                {signUpValue.useGrade === 0 && '소속을 선택해주세요'}
                {signUpValue.useGrade > 0 &&
                  signUpValue.useGrade < 3 &&
                  `${signUpValue.useGrade} 학년 ${signUpValue.useClass} 반`}
                {signUpValue.useGrade === 3 && '그 외 교사'}
                <Image alt="icon" src={ARROWUP_ICON} />
              </button>
              <div
                id="dropdown"
                className={twMerge(
                  isShowDrop
                    ? 'absolute bottom-10 z-10 h-44 w-full divide-y divide-gray-100 overflow-scroll rounded-lg bg-white shadow'
                    : 'hidden',
                )}
              >
                <ul className="z-30 py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(1, 1)}>
                      1학년 1반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(1, 2)}>
                      1학년 2반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(1, 3)}>
                      1학년 3반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(1, 4)}>
                      1학년 4반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(1, 5)}>
                      1학년 5반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(2, 1)}>
                      2학년 1반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(2, 2)}>
                      2학년 2반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(2, 3)}>
                      2학년 3반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(2, 4)}>
                      2학년 4반
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(3, 3)}>
                      그 외 교사
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="h-5">
              <span className="text-red-500">{errorMessage}</span>
            </div>
            <div className="my-4 flex items-center justify-center">
              <button
                className="h-8 w-32 rounded-lg bg-white active:bg-gray-400 active:text-white"
                onClick={async () => handleOnSunbmit()}
              >
                <span className="text-sm font-normal leading-none">회원가입하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
