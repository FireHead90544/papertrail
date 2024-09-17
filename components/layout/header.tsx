import React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '../theme/theme-switcher'

const Header = () => {
  return (
    <header className="container px-4 mx-auto flex justify-between items-center my-4">
        <Link href="/" >
            <span className='text-xl font-medium'>Paper<span className='text-purple-500 text-opacity-90'>Trail</span></span>
        </Link>
        <ThemeToggle />
    </header>
  )
}

export default Header