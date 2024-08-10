'use client'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { InputContainer } from '@/components/Layout'

import { EmailValidationStatus } from '@/libs/emailValidationStatus'
import { auth, firestore } from '@/libs/firebase'
import useSignUpStore from '@/stores/SignUpStore'

import ARROWUP_ICON from '@icon/arrowup_icon.svg'

interface BaseFieldType {
  labelName: string
  inputValue: string
  setFunction: (inputValue: string) => void
}

interface ButtonFieldType extends BaseFieldType {
  firstButton: string
  secondButton: string
}

interface SignFieldType extends BaseFieldType {
  fieldID: string
  inputType: string
  defaultText: string
}

interface EmailFieldType extends SignFieldType {
  emailValidation: EmailValidationStatus
  setEmailValidation: (status: EmailValidationStatus) => void
}

interface PasswordFieldType extends SignFieldType {
  errorMessage: string
  checkFunction: () => boolean
}

interface DropdownFieldType {
  labelName: string
  firstValue: number
  secondValue: number
  dropdownList: Array<{
    grade: number
    class: number
    label: string
  }>
  setFirstFunction: (inputValue: number) => void
  setSecondFunction: (inputValue: number) => void
}

export function SignupInputField() {
  const {
    signUpValue,
    initSignUpValue,
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
  const [isEmailValidation, setIsEmailValidation] = useState<EmailValidationStatus>(EmailValidationStatus.Default)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const route = useRouter()

  // FIXME: 임시 dropdown 리스트
  const gradeClassList = [
    { grade: 1, class: 1, label: '1학년 1반' },
    { grade: 1, class: 2, label: '1학년 2반' },
    { grade: 1, class: 3, label: '1학년 3반' },
    { grade: 1, class: 4, label: '1학년 4반' },
    { grade: 1, class: 5, label: '1학년 5반' },
    { grade: 2, class: 1, label: '2학년 1반' },
    { grade: 2, class: 2, label: '2학년 2반' },
    { grade: 2, class: 3, label: '2학년 3반' },
    { grade: 2, class: 4, label: '2학년 4반' },
    { grade: 3, class: 3, label: '그 외 교사' },
  ]

  // 회원가입 function
  const handleOnSunbmit = async () => {
    const error = validateSignUpValue()

    if (error.isError) {
      setErrorMessage(error.errorMessage)
    } else if (isEmailValidation !== EmailValidationStatus.Success) {
      setErrorMessage('아이디 중복 확인해주세요')
    } else {
      createUserWithEmailAndPassword(auth, `${signUpValue.useEmail}@dongan.com`, signUpValue.usePassword).then(
        async (userCredential) => {
          await setDoc(doc(firestore, 'users', userCredential.user.uid), {
            name: signUpValue.useName,
            email: `${signUpValue.useEmail}@dongan.com`,
            phoneNum: signUpValue.usePhoneNum,
            position: signUpValue.usePosition,
            grade: signUpValue.useGrade,
            class: signUpValue.useClass,
            admin: false,
            bibleReadingDates: [],
            challengeStreakCount: 0,
          }).then(() => {
            initSignUpValue()
            route.push('/', { scroll: false })
          })
        },
      )
    }
  }

  return (
    <InputContainer>
      <DefaultField
        labelName="이름"
        fieldID="name"
        inputType="text"
        defaultText="이름 입력해주세요"
        setFunction={setUseName}
        inputValue={signUpValue.useName}
      />
      <EmailField
        labelName="아이디"
        fieldID="email"
        inputType="text"
        defaultText="아이디 입력해주세요"
        setFunction={setUseEmail}
        inputValue={signUpValue.useEmail}
        emailValidation={isEmailValidation}
        setEmailValidation={setIsEmailValidation}
      />
      <PasswordField
        labelName="비밀번호 (최소 6자 이상)"
        fieldID="password"
        inputType="password"
        defaultText="비밀번호 입력해주세요"
        setFunction={setUsePassword}
        inputValue={signUpValue.usePassword}
        errorMessage="최소 6자 이상이어야 합니다"
        checkFunction={checkPasswordsLength}
      />
      <PasswordField
        labelName="비밀번호 확인"
        fieldID="verify_password"
        inputType="password"
        defaultText="비밀번호 확인 입력해주세요"
        setFunction={setUseVerifyPassword}
        inputValue={signUpValue.useVerifyPassword}
        errorMessage="비밀번호가 다릅니다"
        checkFunction={checkPasswordsMatch}
      />
      <DefaultField
        labelName="전화번호"
        fieldID="phoneNum"
        inputType="number"
        defaultText="전화번호 입력해주세요"
        inputValue={signUpValue.usePhoneNum}
        setFunction={setUsePhoneNum}
      />
      <ButtonField
        labelName="직분"
        inputValue={signUpValue.usePosition}
        firstButton="교사"
        secondButton="학생"
        setFunction={setUsePosition}
      />
      <DropdownField
        labelName="소속"
        firstValue={signUpValue.useGrade}
        secondValue={signUpValue.useClass}
        dropdownList={gradeClassList}
        setFirstFunction={setUseGrade}
        setSecondFunction={setUseClass}
      />
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
    </InputContainer>
  )
}

function DefaultField({ labelName, fieldID, inputType, defaultText, setFunction, inputValue }: SignFieldType) {
  return (
    <div className="flex flex-col gap-y-1">
      <label htmlFor={fieldID} className="ml-1 text-base font-light">
        {labelName}
      </label>
      <input
        id={fieldID}
        type={inputType}
        placeholder={defaultText}
        className="p-1 text-base outline-none"
        value={inputValue}
        onChange={(event) => setFunction(event.target.value)}
      />
    </div>
  )
}

function EmailField({
  labelName,
  fieldID,
  inputType,
  defaultText,
  setFunction,
  inputValue,
  emailValidation,
  setEmailValidation,
}: EmailFieldType) {
  // 이메일 중복 확인
  const checkForDuplicateEmail = async () => {
    try {
      // FIXME: 추후 프로젝트의 진행 방향에 따라 수정해야함
      const emailRegEx = /^010\d{8}@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i
      const useId = `${inputValue}@dongan.com`

      // 이메일 형식 검사
      if (!emailRegEx.test(useId)) {
        setEmailValidation(EmailValidationStatus.InvalidFormat)
        setTimeout(() => setEmailValidation(EmailValidationStatus.Default), 3000)
        return
      }

      const result = query(collection(firestore, 'users'), where('email', '==', useId))

      const querySnapshot = await getDocs(result)

      if (!querySnapshot.empty) {
        setEmailValidation(EmailValidationStatus.Error)

        setTimeout(() => setEmailValidation(EmailValidationStatus.Default), 3000)

        return
      }

      setEmailValidation(EmailValidationStatus.Success)
    } catch (error) {
      console.error('Error checking for duplicate email:', error)
    }
  }
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <label htmlFor={fieldID} className="ml-1 text-base font-light">
          {labelName}
        </label>
        {emailValidation === EmailValidationStatus.Error && (
          <span className="text-sm leading-none text-red-500">이미 존재하는 아이디 입니다.</span>
        )}
        {emailValidation === EmailValidationStatus.InvalidFormat && (
          <span className="text-sm leading-none text-red-500">올바른 아이디 형식이 아닙니다.</span>
        )}
        {emailValidation === EmailValidationStatus.Success && (
          <span className="text-sm leading-none text-green-500">사용 가능한 아이디 입니다.</span>
        )}
      </div>
      <div className="flex gap-x-2">
        <input
          id={fieldID}
          type={inputType}
          placeholder={defaultText}
          className="flex-grow p-1 text-base outline-none"
          value={inputValue}
          onChange={(event) => {
            setEmailValidation(EmailValidationStatus.Default)
            setFunction(event.target.value)
          }}
        />
        <button
          className="h-8 w-24 rounded-lg bg-white active:bg-gray-400 active:text-white"
          onClick={async () => checkForDuplicateEmail()}
        >
          <span className="text-sm font-normal leading-none">중복확인</span>
        </button>
      </div>
    </div>
  )
}

function PasswordField({
  labelName,
  fieldID,
  inputType,
  defaultText,
  setFunction,
  inputValue,
  errorMessage,
  checkFunction,
}: PasswordFieldType) {
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    setIsError(checkFunction())
  }, [inputValue])

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <label htmlFor={fieldID} className="ml-1 text-base font-light">
          {labelName}
        </label>
        {!isError && inputValue && <span className="text-sm leading-none text-red-500">{errorMessage}</span>}
      </div>
      <input
        id={fieldID}
        type={inputType}
        placeholder={defaultText}
        className="p-1 text-base outline-none"
        value={inputValue}
        onChange={(event) => setFunction(event.target.value)}
      />
    </div>
  )
}

function ButtonField({ labelName, setFunction, inputValue, firstButton, secondButton }: ButtonFieldType) {
  return (
    <div className="flex flex-col gap-y-1">
      <label className="ml-1 text-base font-light">{labelName}</label>
      <div className="flex flex-grow justify-between gap-x-4">
        <button
          className={twMerge(
            'flex-grow rounded-lg border-2 border-transparent bg-white py-2',
            inputValue === 'teacher' && 'border-2 border-blue-500 bg-blue-100',
          )}
          onClick={() => setFunction('teacher')}
        >
          {firstButton}
        </button>
        <button
          className={twMerge(
            'flex-grow rounded-lg border-2 border-transparent bg-white py-2',
            inputValue === 'student' && 'border-2 border-blue-500 bg-blue-100',
          )}
          onClick={() => setFunction('student')}
        >
          {secondButton}
        </button>
      </div>
    </div>
  )
}

function DropdownField({
  labelName,
  firstValue,
  secondValue,
  dropdownList,
  setFirstFunction,
  setSecondFunction,
}: DropdownFieldType) {
  const [isShowDrop, setIsShowDrop] = useState<boolean>(false)

  // 학년&반 set
  const setUserGradeAndClass = (gradeNum: number, classNum: number) => {
    setFirstFunction(gradeNum)
    setSecondFunction(classNum)

    setIsShowDrop(!isShowDrop)
  }

  return (
    <div className="relative flex flex-col gap-y-1">
      <label htmlFor="affiliation" className="ml-1 text-base font-light">
        {labelName}
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
        {firstValue === 0 && '소속을 선택해주세요'}
        {firstValue > 0 && firstValue < 3 && `${firstValue} 학년 ${secondValue} 반`}
        {firstValue === 3 && '그 외 교사'}
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
          {dropdownList.map((item, index) => (
            <li key={index}>
              <button className="block px-4 py-2" onClick={() => setUserGradeAndClass(item.grade, item.class)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
