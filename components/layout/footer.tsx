import React from 'react'

const Footer = () => {
  return (
    <footer className="container flex px-4 mt-2 mx-auto justify-center items-center">
        <span className="text-muted-foreground">&copy; {new Date().getFullYear()} All Rights & Some Lefts Reserved</span>
    </footer>
  )
}

export default Footer