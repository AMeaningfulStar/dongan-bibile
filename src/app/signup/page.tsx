'use client'

import Image from 'next/image'

import { AuthLayout, OverlayBackground } from '@/components/Layout'
import { Title } from '@/components/Text'

import { SignupInputField } from '@/components/InputField'
import SIGNUP_BACKGROUND from '@image/Signup_Background.svg'

export default function SignUp() {
  return (
    <AuthLayout style="relative flex items-center justify-center">
      <Image alt="backbround image" src={SIGNUP_BACKGROUND} className="mb-2.5" />
      <OverlayBackground>
        <div className="px-5 py-2">
          <Title textColor="text-white">회원가입</Title>
        </div>
        <SignupInputField />
      </OverlayBackground>
    </AuthLayout>
  )
}
