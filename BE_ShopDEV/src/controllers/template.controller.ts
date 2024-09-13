import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { Created } from '~/core/success.response'
import { createTemplate } from '~/services/template.service'

class TemplateController {
  static async createTemplate(req: Request<ParamsDictionary, any, { html: string; name: string }>, res: Response) {
    const { html, name } = req.body
    new Created({ message: 'created template', metadata: await createTemplate({ html: html, name: name }) })
  }
}
export default TemplateController
