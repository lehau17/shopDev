import { BadRequestResponse } from '~/core/error.response'
import TemplateModel from '~/models/template.model'
import fs from 'fs'
import path from 'path'
export const createTemplate = async ({ html, name }: { html: string; name: string }) => {
  //check exist in template
  // const foundTemplate = await getTemplateByName({ name })
  // if (foundTemplate) {
  //   throw new BadRequestResponse({ message: `TemplateModel ${foundTemplate} already exists` })
  // }
  // //create template
  // return TemplateModel.create({ tem_html: html, tem_name: name })

  //hard core
  const htmlCreated = fs.readFileSync(path.join(__dirname, '../../public/index.html'))
  return TemplateModel.create({ tem_html: htmlCreated, tem_name: 'TEMPLATE-REGISTER_USER' })
}

export const getTemplateByName = async ({ name }: { name: string }) => {
  return TemplateModel.findOne({
    tem_name: name
  }).lean()
}
