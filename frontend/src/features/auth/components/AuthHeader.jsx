import {
  useEffect,
  useState,
} from 'react'

import logo from '../../../assets/images/logo.png'

function AuthHeader({
  title,
  subtitle,
  animateTitle = false,
}) {
  const [
    displayedTitle,
    setDisplayedTitle,
  ] = useState(
    animateTitle
      ? ''
      : title,
  )

  useEffect(() => {
    if (!animateTitle) {
      setDisplayedTitle(title)

      return
    }

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (
      prefersReducedMotion
    ) {
      setDisplayedTitle(title)

      return
    }

    setDisplayedTitle('')

    let currentIndex = 0

    const typingInterval =
      window.setInterval(() => {
        currentIndex += 1

        setDisplayedTitle(
          title.slice(
            0,
            currentIndex,
          ),
        )

        if (
          currentIndex >=
          title.length
        ) {
          window.clearInterval(
            typingInterval,
          )
        }
      }, 100)

    return () => {
      window.clearInterval(
        typingInterval,
      )
    }
  }, [
    title,
    animateTitle,
  ])

  return (
    <header
      className="
        mb-7
        flex
        flex-col
        items-center
        text-center
      "
    >
      <img
        src={logo}
        alt="شعار سوقيا"
        className="
          mb-4
          h-16
          w-16
          object-contain
        "
      />

      <h1
        className="
          min-h-[34px]
          text-[26px]
          font-bold
          leading-tight
          text-primary
        "
      >
        {displayedTitle}
      </h1>

      <p
        className="
          mt-2
          text-sm
          leading-5
          text-text-muted
        "
      >
        {subtitle}
      </p>
    </header>
  )
}

export default AuthHeader