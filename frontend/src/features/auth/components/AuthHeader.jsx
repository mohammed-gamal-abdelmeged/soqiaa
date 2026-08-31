import logo from '../../../assets/images/logo.png'

function AuthHeader({ title, subtitle }) {
  return (
    <header className="mb-8 flex flex-col items-center text-center">
      <img
        src={logo}
        alt="شعار سوقيا"
        className="mb-6 h-24 w-24 object-contain"
      />

      <h1 className="text-2xl font-bold leading-8 text-primary">
        {title}
      </h1>

      <p className="mt-2 text-base leading-6 text-text-muted">
        {subtitle}
      </p>
    </header>
  )
}

export default AuthHeader