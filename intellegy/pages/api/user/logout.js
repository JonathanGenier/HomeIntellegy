import cookie from 'cookie'

export default async function handler(req, res) {
  const { method } = req
  console.log("LOGOUT")

  try {
    res.setHeader('Set-Cookie', cookie.serialize('auth', 'deleted', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/'
    }))
    res.status(200).json({success: true })
  } catch (e) {
    res.status(400).json({success: false })
  }
}