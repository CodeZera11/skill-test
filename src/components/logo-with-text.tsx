import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LogoWithText = () => {
  return (
    <Link href="/" className="flex items-center gap-0">
      <Image
        src="/logo.png"
        alt="SkillTest logo"
        width={72}
        height={72}
        priority
      />
      <div className="flex flex-col -ml-1">
        <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
          SkillTest
        </span>
        <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-xs font-light italic text-transparent -mt-1">
          Let&apos;s Practice together
        </span>
      </div>
    </Link>
  )
}

export default LogoWithText