import controllers from './controllers'

const web = controllers.web

class MetaModel {
  constructor() {
    //
  }

  static get _name() {
    return this._model
  }

  static get res_model() {
    return this._model
  }

  static get env() {
    return this._env
  }

  static with_context(kwargs = {}, context) {
    const context2 = context ? context : this.env.context
    const context3 = { ...context2, ...kwargs }
    return this.with_env(this.env.copy(context3))
  }

  static with_env(env) {
    const OldModel = this
    class NewModel extends OldModel {
      constructor(...args) {
        super(...args)
      }
    }

    NewModel._env = env
    return NewModel
  }

  static async execute_kw(method, args = [], kwargs = {}) {
    const kwargs2 = { ...kwargs }

    if (!Object.keys(kwargs).includes('context'))
      kwargs2.context = this.env.context

    const payload = { model: this._name, method, args, kwargs: kwargs2 }
    return web.dataset.call_kw(payload)
  }

  static async call_button(method, rids, kwargs = {}) {
    const args = [rids]
    const payload = { model: this._name, method, args, kwargs }
    return web.dataset.call_button(payload)
  }

  static async execute(method, ...args) {
    return this.execute_kw(method, args, {})
  }
}

MetaModel._env = undefined
MetaModel._model = undefined

class BaseModel extends MetaModel {
  constructor(payload = {}) {
    super(payload)
  }

  static async fields_get(allfields, attributes) {
    const method = 'fields_get'
    return this.execute(method, allfields, attributes)
  }

  static async search(domain, kwargs = {}) {
    const method = 'search'
    return this.execute_kw(method, [domain], kwargs)
  }

  static async read_group(kwargs) {
    return this.execute_kw('read_group', [], kwargs)
  }

  /** 分组 */

  static async read_progress_bar(domain, group_by, progress_bar) {
    // const progress_bar = {
    //   colors: {
    //     planned: 'success',
    //     today: 'warning',
    //     overdue: 'danger'
    //   },
    //   overdue: 'danger',
    //   planned: 'success',
    //   today: 'warning',
    //   field: 'activity_state',
    //   modifiers: {},
    //   sum_field: false
    // }

    return this.execute_kw('read_progress_bar', [], {
      domain,
      group_by,
      progress_bar
    })
  }

  static async web_read_group(kwargs = {}) {
    // domain, fields, groupby,
    // limit=None, offset=0, orderby=False,
    // lazy=True,
    // expand=False, expand_limit=None, expand_orderby=False

    return this.execute_kw('web_read_group', [], kwargs)
  }

  static async web_search_read(kwargs = {}) {
    return this.execute_kw('web_search_read', [], kwargs)
  }

  static _format_dict(one) {
    const fmt = (fld, val) => {
      const meta = this._fields[fld] || {}
      if (meta.type === 'boolean') {
        return val
      } else if (meta.type === 'integer') {
        return val || 0
      } else if (meta.type === 'float') {
        return val || 0.0
      } else if (meta.type === 'monetary') {
        return val || 0.0
      } else if (meta.type === 'integer') {
        return val || 0
      } else {
        return val || null
      }
    }

    return Object.keys(one).reduce((acc, fld) => {
      acc[fld] = fmt(fld, one[fld])
      return acc
    }, {})
  }

  static _format_result(result) {
    return result.map(one => {
      return this._format_dict(one)
    })
  }

  static async search_read(kwargs = {}) {
    const res = await this.execute_kw('search_read', [], kwargs)
    return this._format_result(res)
  }

  static async read(ids, kwargs = {}) {
    const method = 'read'
    const get_args_kwargs = () => {
      if (Array.isArray(kwargs)) return [[ids, kwargs], {}]
      const { fields = [], ...kwargs2 } = kwargs
      return [[ids, fields], kwargs2]
    }

    const [args, kwargs2] = get_args_kwargs()
    const res = await this.execute_kw(method, args, kwargs2)
    return this._format_result(res)
  }

  static async copy(rid) {
    const method = 'copy'
    return this.execute(method, rid)
  }

  static async write(rid, vals) {
    const method = 'write'
    return this.execute(method, rid, vals)
  }

  static async create(vals) {
    return this.execute('create', vals)
  }

  static async unlink(rid) {
    const method = 'unlink'
    return this.execute(method, rid)
  }

  static async action_unarchive(ids) {
    const method = 'action_unarchive'
    return this.execute(method, ids)
  }

  static async action_archive(ids) {
    const method = 'action_archive'
    return this.execute(method, ids)
  }

  static async default_get(fields) {
    return this.execute('default_get', fields)
  }

  static async name_search(kwargs = {}) {
    // const { name, args, operator, limit } = kwargs
    return this.execute_kw('name_search', [], kwargs)
  }

  static async name_get(ids) {
    return this.execute('name_get', ids)
  }

  static async onchange(ids, values, field_name, field_onchange) {
    const args = [ids, values, field_name, field_onchange]
    const res = await this.execute('onchange', ...args)
    const { value } = res
    return { ...res, value: this._format_dict(value) }
  }

  // static async onchange(ids, values, field_name, field_onchange) {
  //   return this.execute('onchange', ids, values, field_name, field_onchange)

  //   // const session_info = this._odoo.session_info
  //   // const server_version_info = session_info.server_version_info
  //   // const version = server_version_info[0]
  //   // const is_call_default =
  //   //   (!field_name || (Array.isArray(field_name) && !field_name.length)) &&
  //   //   version == 13

  //   // // console.log(version, is_call_default)
  //   // if (is_call_default)
  //   //   return this.default_get_onchange(values, field_onchange)
  //   // else
  //   //   return this.execute('onchange', ids, values, field_name, field_onchange)
  // }

  //   static async default_get_onchange(values, field_onchange) {
  //     const fields = Object.keys(field_onchange).filter(
  //       fld => fld.split('.').length === 1
  //     )

  //     const default_get1 = await this.default_get(fields)

  //     const _get_default = col => {
  //       const meta = this._fields[col]

  //       if (['many2many'].includes(meta.type)) return [[6, false, []]]
  //       else if (['one2many'].includes(meta.type)) return []
  //       else if (['float', 'integer', 'monetary'].includes(meta.type)) return 0
  //       else if (['text', 'html'].includes(meta.type)) return ''
  //       return false
  //     }

  //     const values_onchange2 = fields.reduce((acc, cur) => {
  //       acc[cur] = _get_default(cur)
  //       return acc
  //     }, {})

  //     const values_onchange = { ...values_onchange2, ...values, ...default_get1 }

  //     const field_name = fields
  //     const args = [[], values_onchange, field_name, field_onchange]
  //     const onchange = await this.execute('onchange', ...args)

  //     // # TBD: default_get 里面 可能有 m2o o2m 需要处理
  //     // default_get, m2o 返回值 是 id, 需要 补充上 display_name
  //     const default_get2 = {}

  //     for (const col of Object.keys(default_get1)) {
  //       const meta = this._fields[col]
  //       // console.log('default get 2', col, meta, default_get1)

  //       // TBD, res.config.settings 出现了  meta 为空的 情况

  //       if (meta && meta.relation && meta.type === 'many2one') {
  //         const ref_val = default_get1[col]

  //         if (ref_val) {
  //           const ref_ids = Array.isArray(ref_val) ? ref_val : [ref_val]
  //           const domain = [['id', 'in', ref_ids]]
  //           const ref_records = await this.env
  //             .model(meta.relation)
  //             .execute_kw('name_search', [], { args: domain })

  //           const ref_rec = ref_records[0]

  //           default_get2[col] = [...ref_rec]
  //         } else {
  //           default_get2[col] = default_get1[col]
  //         }
  //       } else {
  //         default_get2[col] = default_get1[col]
  //       }
  //     }

  //     // const values_ret = { ...values, ...default_get2, ...onchange.value }
  //     const values_ret = { ...default_get2, ...onchange.value }
  //     const onchange2 = { ...onchange, value: values_ret }

  //     return onchange2
  //   }
}

function sleep(millisecond) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, millisecond)
  })
}

function _onchange_callid() {
  return Math.floor(Math.random() * 1000000000 + 1)
}

// const cp = item => JSON.parse(JSON.stringify(item))

// const print_date = () => {
//   const date = new Date()
//   console.log(
//     date.getHours(),
//     date.getMinutes(),
//     date.getSeconds(),
//     date.getMilliseconds()
//   )
// }

class EditModel {
  constructor(payload = {}) {
    const { Model: OdooModel, res_id, record = {}, values = {} } = payload
    this.Model = OdooModel
    this.res_id = res_id
    this.record = { ...record }
    this.values = { ...values }

    this.queue = []
  }

  async _wait(callid) {
    const to_wait = () => {
      const first = this.queue[0]
      return first[0] !== callid
    }

    let iswait = to_wait()
    let count = 10
    //   console.log('wait1:', cp(this.queue), count, iswait)

    while (count > 0 && iswait) {
      await sleep(100)
      count = count - 1
      iswait = to_wait()
      // console.log('wait:', cp(this.queue), count, iswait)
    }
  }

  async call_queue(item) {
    // console.log('queue 1', item, cp(this.queue))
    //   print_date()

    const callid = _onchange_callid()
    this.queue.push([callid, ...item])

    //   console.log('queue 2', item, cp(this.queue))
    //   print_date()

    await this._wait(callid)
    const [method, ...args] = item
    const res = await this[method](...args)
    await sleep(100)
    this.queue.shift()
    return res
    //   console.log('queue 9', item, cp(this.queue))
    //   print_date()
  }

  async onchange({ fname, value, kwargs = {}, callback }) {
    this.call_queue(['handleOnchange', { fname, value, kwargs, callback }])
  }

  async commit({ callback }) {
    this.call_queue(['handleOnCommit', { callback }])
  }

  async handleOnCommit({ callback }) {
    const record = this.record
    const values = this.values
    const res_id = this.res_id
    const id2 = await this.Model.web_commit({ res_id, record, values })
    callback(id2)
  }

  async handleOnchange({ fname, value, kwargs = {}, callback }) {
    const result = await this.Model.web_onchange({
      ids: this.res_id ? [this.res_id] : [],
      record: this.record,
      values: { ...this.values, [fname]: value },
      fname,
      kwargs
    })

    const { values = {} } = result
    //   Todo: 对返回 domain 的处理

    this.values = { ...values }
    if (callback) {
      callback(result)
    }

    return result
  }
}

BaseModel._EditModel = EditModel

export class Model extends BaseModel {
  constructor(payload = {}) {
    super(payload)
  }

  static _commit_get_readonly(meta, state) {
    // 仅仅 在 commit 时, 组织 values, 需要
    // TBD, 测试  销售订单 等 有 state的模型
    // console.log('vvwr 1', meta, record)

    if (meta.states === undefined) return meta.readonly

    if (state && meta.states && meta.states[state]) {
      const readonly3 = meta.states[state].reduce((acc, cur) => {
        acc[cur[0]] = cur[1]
        return acc
      }, {})

      if (readonly3.readonly !== undefined) return readonly3.readonly
    }

    return meta.readonly
  }

  // ok
  static _get_values_for_write({ state, values }) {
    const all_keys = Object.keys({ ...values })

    return all_keys.reduce((acc, fld) => {
      const meta = this._fields[fld] || {}
      const readonly = this._commit_get_readonly(meta, state)

      if (!readonly) {
        const val = values[fld]
        const val2 = val && meta.type === 'many2one' ? val[0] : val
        acc[fld] = val2
      }

      return acc
    }, {})
  }

  static async web_commit(payload) {
    const { res_id, record = {}, values = {} } = payload
    //
    if (!values) return
    if (!Object.keys(values).length) return

    const state_value = 'state' in values ? values.state : record.state

    const values2 = this._get_values_for_write({ state: state_value, values })

    if (res_id) {
      await this.write(res_id, values2)
      return res_id
    } else {
      return this.create(values2)
    }
  }

  // ok
  static _get_values_for_onchange({ record, values }) {
    const all_keys = Object.keys({ ...record, ...values })
    return all_keys.reduce((acc, fld) => {
      const meta = this._fields[fld] || {}
      if (meta.type === 'many2many') {
        const val =
          fld in values ? values[fld] : [[6, false, record[fld] || []]]
        acc[fld] = val
      } else if (meta.type === 'one2many') {
        const val =
          fld in values
            ? values[fld]
            : (record[fld] || []).map(item => [4, item, false])

        acc[fld] = val
      } else {
        const val = fld in values ? values[fld] : record[fld]
        const val2 = val && meta.type === 'many2one' ? val[0] : val
        acc[fld] = val2
      }

      return acc
    }, {})
  }

  static async web_onchange_new(payload = {}) {
    const { values = {} } = payload

    const field_onchange = Object.keys(this._fields).reduce((acc, fld) => {
      acc[fld] = '1'
      return acc
    }, {})

    const result = await this.onchange([], values, [], field_onchange)

    const { value: value_ret, ...res } = result
    const values_ret = { ...values, ...value_ret }
    return { ...res, values: values_ret }
  }

  static async web_onchange(payload) {
    // eslint-disable-next-line no-unused-vars
    const { ids = [], record = {}, values = {}, fname, kwargs = {} } = payload

    // 页面编辑时 触发的
    // 参数:
    // ids: 待编辑的记录 id
    // record: 编辑前的所有字段的数据
    // values: 所有编辑过的字段的数据
    // fname: 正在编辑的字段
    // kwargs: 额外的参数 , 待处理

    const field_onchange = Object.keys(this._fields).reduce((acc, fld) => {
      acc[fld] = '1'
      return acc
    }, {})

    // values 中 可能有 id,  需要删除
    const vals_onchg = this._get_values_for_onchange({ record, values })

    const result = await this.onchange(ids, vals_onchg, fname, field_onchange)

    const { value: value_ret, ...res } = result
    // console.log(record, values, value_ret, fname)

    // after onchange
    // 1. _onchange_domain
    // {domain} = res
    // 2. set_value_by_onchange
    const values_ret = { ...values, ...value_ret }

    // relation 字段, onchange 时. 需要  for_write
    // if (kwargs.for_write !== undefined) {
    //   values_ret[fname] = kwargs.for_write
    // }
    //

    // 3. _after_onchange_async
    // m2m 需要 更新数据

    // done:
    return { record, ...res, values: values_ret }
  }

  static init_edit_model({ res_id, record = {}, values = {} }) {
    //
    return new this._EditModel({ Model: this, res_id, record, values })
  }
}
