import { Environment } from './env'
import service from './service'

import { JsonRequest } from './request'
import controller from './controllers'
// const { web, rerport, web_editor } = controller

export class RPC {
  constructor() {}

  static init({ baseURL, timeout, addons_list }) {
    JsonRequest.baseURL = baseURL
    JsonRequest.timeout = timeout

    if (addons_list) {
      service.Addons.addons_list = [
        ...service.Addons.addons_list,
        ...addons_list
      ]
    }
  }

  static get env() {
    return new Environment()
  }
}

Object.keys(controller).forEach(item => {
  RPC[item] = controller[item]
})

const rpc = RPC

export default rpc
