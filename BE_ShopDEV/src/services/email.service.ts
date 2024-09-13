import { BadRequestResponse } from '~/core/error.response'
import { getTemplateByName } from './template.service'
import transporter from '~/configs/nodemailer.gmail.config'
import { createOtp } from './otp.service'
import { replaceTemplate } from '~/utils/template'

export const sendEmail = async (email: string, typeTemplate: string, subject: string) => {
  //find template
  const foundTemplate = await getTemplateByName({ name: typeTemplate })
  if (!foundTemplate) throw new BadRequestResponse({ message: 'Template not found' })
  // edit template with otp
  const otp = await createOtp({ email })
  if (!otp) throw new BadRequestResponse({ message: 'Error occured ' })
  //replace template
  const html = replaceTemplate(foundTemplate.tem_html, {
    UserName: email,
    ConfirmationLink: 'http://localhost:3000/api/v1/user/verify-user?token=' + otp.otp_token
  })
  //send email
  transporter.sendMail(
    {
      from: 'hau17131203@gmail.com',
      to: email,
      subject: subject,
      html
    },
    (err, info) => {
      if (err) throw err
      console.log(info)
    }
  )
  return 1
}
