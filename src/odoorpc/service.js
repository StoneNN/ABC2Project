const addons_load = AddonsFiles => {
  const fn_get = (type, all, module_name, format) => {
    const records1 = all[type]
    return Object.keys(records1).reduce((acc, cur) => {
      const xml_id = `${module_name}.${cur}`
      const one = { ...records1[cur], xml_id, id: xml_id }
      acc[xml_id] = format ? format(one) : one
      return acc
    }, {})
  }

  const patch_module_name = (module_name, str) => {
    if (!str) {
      return undefined
    } else {
      const len = str.split('.').length
      if (len === 1) {
        return `${module_name}.${str}`
      } else {
        return str
      }
    }
  }

  const view_get_first = (res_model, mode) => {
    const res = Object.values(addonsAll.views)
      .filter(item => item.model === res_model && item.type === mode)
      .sort((a, b) => a.priority - b.priority)

    if (res.length) {
      return res[0].xml_id
    } else {
      return undefined
    }
  }

  // const AddonsFiles = require.context('@/odoorpc/addons', true, /\.js$/)

  const addonsAll = AddonsFiles.keys().reduce((acc, modulePath) => {
    const value = AddonsFiles(modulePath)
    const paths = modulePath.split('/')

    if (paths[2] === 'views') {
      const module_name = paths[1]

      if (!acc.actions) {
        acc.actions = {}
      }
      if (!acc.menus) {
        acc.menus = {}
      }
      if (!acc.views) {
        acc.views = {}
      }

      const actions = fn_get('actions', value.default, module_name)

      const menus = fn_get('menus', value.default, module_name, one => {
        const one2 = { ...one }
        const { parent, action } = one
        const parent2 = patch_module_name(module_name, parent)
        const action2 = patch_module_name(module_name, action)
        if (parent2) one2.parent = parent2
        if (action2) one2.action = action2
        return one2
      })

      const views = fn_get('views', value.default, module_name, one => {
        const one2 = {
          ...one,
          buttons: { ...(one.buttons || {}) },
          priority: one.priority || 16
        }

        if (one2.buttons.create === undefined) one2.buttons.create = true
        if (one2.buttons.edit === undefined) one2.buttons.edit = true
        if (one2.buttons.delete === undefined) one2.buttons.delete = true

        return one2
      })

      acc.actions = { ...acc.actions, ...actions }
      acc.menus = { ...acc.menus, ...menus }
      acc.views = { ...acc.views, ...views }
    }
    return acc
  }, {})

  const actions = Object.values(addonsAll.actions).reduce((acc, one) => {
    const one2 = { ...one, views: { ...(one.views || {}) } }
    const { xml_id, res_model, view_mode = ['tree', 'form'], views = {} } = one
    const module_name = xml_id.split('.')[0]
    view_mode.forEach(mode => {
      one2.views[mode] =
        patch_module_name(module_name, views[mode]) ||
        view_get_first(res_model, mode)
    })
    acc[one.xml_id] = one2
    return acc
  }, {})

  addonsAll.actions = actions

  const menus = Object.values(addonsAll.menus)
    .sort((a, b) => a.sequence - b.sequence)
    .filter(item => item.active !== false)
    .reduce((acc, cur) => {
      acc[cur.xml_id] = cur
      return acc
    }, {})

  addonsAll.menus = menus
  // console.log('addonsAll', addonsAll)

  return addonsAll
}

class Addons {
  constructor() {}

  static get data() {
    const res = this.addons_list.reduce((acc, files) => {
      const one = addons_load(files)
      Object.keys(one).forEach(item => {
        if (!acc[item]) {
          acc[item] = {}
        }
        acc[item] = { ...acc[item], ...one[item] }
      })
      return acc
    }, {})
    // console.log(res)
    return res
  }
}

Addons.addons_list = []

const menus_load = () => {
  const addons_data = Addons.data

  const addons_menus = addons_data.menus || {}

  const menus_get = (root = {}) => {
    const children = Object.values(addons_menus)
      .filter(item => {
        if (!root.xml_id) {
          return !item.parent
        } else {
          return item.parent === root.xml_id
        }
      })
      .map(item => {
        return {
          ...item,
          children: menus_get(item)
        }
      })

    return children
  }

  const children = menus_get()

  return { children }
}

class Menus {
  constructor() {
    this._addons = Addons.data

    this._menus = menus_load()
  }

  get menus() {
    return this._menus
  }

  get menus_list() {
    return this._addons.menus
  }
}

const actions_load = action => {
  const addons_data = Addons.data
  const actions = addons_data.actions
  const info = actions[action]

  const views_all = addons_data.views

  const views = Object.keys(info.views).reduce((acc, cur) => {
    acc[cur] = views_all[info.views[cur]]
    return acc
  }, {})

  // console.log(action, info, views, views_all)

  return { ...info, views }
}

// eslint-disable-next-line no-unused-vars
const cp = val => JSON.parse(JSON.stringify(val))

class Action {
  constructor(action_id) {
    const info =
      typeof action_id === 'string' ? actions_load(action_id) : action_id
    this._raw_info = info
  }

  get info() {
    return this._raw_info
  }

  // static _actions_load(){

  // }
}

class BaseView {
  constructor(action_id, payload = {}) {
    const { env, type, fields = {} } = payload
    this._action = new Action(action_id)
    this._type = type
    this._env = env
    this._fields_info = fields
  }

  get env() {
    return this._env
  }

  get action_info() {
    return this._action.info
  }

  get res_model() {
    return this.action_info.res_model
  }
  get buttons() {
    const action = this.action_info
    const view = action.views[this._type]
    return view.buttons
  }

  get fields() {
    return this._fields_info
  }

  get fields_list() {
    return Object.keys(this.fields)
  }

  get view_info() {
    return {
      action: this.action_info,
      view: {
        fields: this.fields
      }
    }
  }

  get Model() {
    const model = this.res_model
    const Model = this.env.model(model, { fields: this.fields })
    return Model
  }

  async _load_x2m_views(meta) {
    const x2m = new Relation(meta, { env: this.env })
    return x2m._load_views()
  }

  async _load_fields() {
    const model = this.res_model
    const Model = this.env.model(model)
    const action = this.action_info
    const fields_raw = action.views[this._type].fields
    const fields_list = Object.keys(fields_raw)
    const info = await Model.fields_get(fields_list)

    const fields = Object.keys(fields_raw).reduce((acc, cur) => {
      acc[cur] = { ...(info[cur] || {}), ...(fields_raw[cur] || {}) }
      return acc
    }, {})

    // console.log(fields)

    // for (const fld in fields) {
    //   // console.log(fields, fld, fields[fld])
    //   const meta = fields[fld]
    //   if (meta.widget === 'x2many_tree') {
    //     const views = await this._load_x2m_views(meta)
    //     // console.log(fld, meta.views, views)
    //     meta.views = views
    //   }
    // }

    this._fields_info = fields

    return fields
  }

  async load_fields() {
    return this._load_fields()
  }
}

class TreeView extends BaseView {
  constructor(action_id, payload = {}) {
    super(action_id, { ...payload, type: 'tree' })
  }

  async search_read() {
    const Model = this.Model
    const fields = this.fields_list
    return Model.search_read({ fields })
  }
}

class FormView extends BaseView {
  constructor(action_id, payload = {}) {
    super(action_id, { ...payload, type: 'form' })
    this.edit_model = undefined
  }

  async _read_one(res_id) {
    const Model = this.Model
    const fields = this.fields_list
    const res = await Model.read(res_id, { fields })
    return res[0]
  }

  async read(res_id) {
    return this._read_one(res_id)
  }

  async onchange_new() {
    const Model = this.Model
    const result = await Model.web_onchange_new({ values: {} })

    const { values } = result

    this.edit_model = Model.init_edit_model({
      res_id: undefined,
      record: {},
      values: { ...values }
    })

    return { record: {}, ...result }
  }

  set_editable(record) {
    const Model = this.Model
    this.edit_model = Model.init_edit_model({
      res_id: record.id,
      record,
      values: {}
    })

    // todo: m2m o2m 做处理
    return { ...record }
  }

  onchange(fname, value, callback) {
    if (this.edit_model) {
      // Todo: 对返回 domain 的处理
      this.edit_model.onchange({ fname, value, callback })
    }
  }

  unlink(res_id) {
    // 页面删除按钮调用
    const Model = this.Model
    return Model.unlink(res_id)
  }

  commit(callback) {
    // 页面 save 按钮调用
    if (this.edit_model) {
      this.edit_model.commit({ callback })
    }
  }
}

class Relation {
  constructor(field_info, payload) {
    const { env, parent } = payload
    this._env = env
    this._field_info = field_info
    this._views = {}
    this._parent_info = parent
  }

  get field_info() {
    const views = this._field_info.views || {}
    return { ...this._field_info, views: { ...views, ...this._views } }
  }

  get env() {
    return this._env
  }

  get Model() {
    const model = this.field_info.relation
    return this.env.model(model)
  }

  async _load_views() {
    const meta = this.field_info

    const is_x2many_tree =
      ['one2many', 'many2many'].includes(meta.type) &&
      meta.widget === 'x2many_tree'

    if (!is_x2many_tree) {
      return { tree: {}, form: {} }
    }

    const views = meta.views || {}
    const treeview = views.tree || {}
    const raw_tree = treeview.fields || { display_name: {} }
    const formview = views.form || {}
    const raw_form = formview.fields || { display_name: {} }

    const fields_raw = { ...raw_tree, ...raw_form }

    const fields_info = await this.Model.fields_get(Object.keys(fields_raw))

    const fields_tree = Object.keys(raw_tree).reduce((acc, cur) => {
      acc[cur] = { ...fields_info[cur], ...(raw_tree[cur] || {}) }
      return acc
    }, {})

    const fields_form = Object.keys(raw_form).reduce((acc, cur) => {
      acc[cur] = { ...fields_info[cur], ...(raw_form[cur] || {}) }
      return acc
    }, {})

    const views_info = {
      tree: { ...treeview, fields: fields_tree },
      form: { ...formview, fields: fields_form }
    }

    return views_info
  }

  async load_views() {
    const views = await this._load_views()
    this._views = views
    return views
  }

  get tree() {
    return new X2mTree(this.field_info, {
      env: this.env,
      parent: this._parent_info
    })
  }

  get form() {
    return new X2mForm(this.field_info, {
      env: this.env,
      parent: this._parent_info
    })
  }

  async name_get(ids) {
    const res = await this.Model.name_get(ids)
    return res
  }

  async name_search() {
    return this.Model.name_search({ limit: 0 })
  }
}

class X2mBase {
  constructor(field_info, payload) {
    const { env, type, parent } = payload
    this._type = type
    this._env = env
    this._field_info = field_info
    this._parent_info = parent
  }

  get parent_info() {
    return this._parent_info
  }

  get parent() {
    const info = this.parent_info
    const { action, view } = info
    const { fields } = view
    const env = this.env
    return new FormView(action, { env, fields })
  }

  get field_info() {
    return this._field_info
  }

  get env() {
    return this._env
  }

  get Model() {
    const model = this.field_info.relation
    const fields_form = this.field_info.views.form.fields
    const fields_tree = this.field_info.views.tree.fields

    return this.env.model(model, { fields: { ...fields_form, ...fields_tree } })
  }

  get fields_list() {
    return Object.keys(this.fields)
  }

  get fields() {
    const view = this.field_info.views[this._type]
    return view.fields
  }
}

const tuples_to_ids = tuples => {
  // m2m
  // [6,],[5,],[4,id],[3,id]
  //

  // console.log('tuples_to_ids 1', tuples)

  const ids = tuples.reduce((acc, tup) => {
    const op = tup[0]
    if (op === 6) return [...tup[2]]
    if (op === 5) return []

    if ([4, 0, 1].includes(op)) {
      const rid = tup[1]
      if (acc.includes(rid)) return [...acc]
      else return [...acc, rid]
    }

    if ([3, 2].includes(op)) return acc.filter(item => item !== tup[1])

    // 不应该走到这里
    return acc
  }, [])

  // console.log('tuples_to_ids 2', ids)
  return ids
}

class X2mTree extends X2mBase {
  constructor(field_info, payload) {
    super(field_info, { ...payload, type: 'tree' })
  }

  async read(ids) {
    // console.log('load_relation_data: ', ids, this.field_info)

    const fields_tree = this.fields
    const fields_form = this.field_info.views.form.fields
    const fields_list = Object.keys({ ...fields_tree, ...fields_form })

    // const fields_list = this.fields_list
    const res = await this.Model.read(ids, fields_list)
    return res
  }

  values_display(records, values_in) {
    // console.log(records, values_in)
    const fields_tree = this.fields
    const fields_form = this.field_info.views.form.fields
    const fields = { ...fields_tree, ...fields_form }
    // console.log(fields)

    const values = [...records.map(item => [4, item.id, item]), ...values_in]

    // console.log(records, values)

    const merge = (rec, vals) => {
      const all_keys = Object.keys({ ...rec, ...vals })
      return all_keys.reduce((acc, fld) => {
        const meta = fields[fld] || {}
        if (meta.type === 'many2many') {
          acc[fld] = fld in vals ? tuples_to_ids(vals[fld]) : rec[fld]
        } else if (meta.type === 'one2many') {
          acc[fld] = []
        } else {
          acc[fld] = fld in vals ? vals[fld] : rec[fld]
        }
        return acc
      }, {})
    }

    const vals = values.reduce((acc, tup) => {
      const op = tup[0]

      if (op === 6) {
        // m2m table 编辑时 会用到
        // acc = this.m2m_records
        acc = []
      } else if (op === 5) {
        acc = []
      } else if ([3, 2].includes(op)) {
        acc = acc.filter(item => item.id !== tup[1])
      } else if (op === 4) {
        const me = acc.find(item => tup[1] === item.id)
        if (!me) acc = [...acc, tup[2]]
      } else if (op === 1 || op === 0) {
        const rec_index = acc.findIndex(item => item.id === tup[1])
        const rec_me = rec_index >= 0 ? acc[rec_index] : {}
        const me = merge(rec_me, tup[2])

        const me2 = op === 0 ? { id: tup[1], ...me } : me

        if (rec_index >= 0) acc[rec_index] = me2
        else acc.push(me2)
      } else {
        //
      }

      return acc
    }, [])
    // console.log('values2,', vals)

    return [...vals]
  }

  x2mform_get() {
    //
    const x2mform = new X2mForm(this.field_info, {
      env: this.env,
      type: 'form'
    })

    return x2mform
  }
}

class X2mForm extends X2mBase {
  constructor(field_info, payload) {
    super(field_info, { ...payload, type: 'form' })
    this.edit_model = undefined
  }

  async read(ids) {
    const fields_list = this.fields_list
    const res = await this.Model.read(ids, fields_list)
    return res[0]
  }

  async onchange_new(parentData) {
    const parent = this.parent

    const { relation_field } = this.field_info
    const parent_values = parent.Model._get_values_for_onchange(parentData)
    const values = { [relation_field]: parent_values }

    const Model = this.Model
    const result = await Model.web_onchange_new({ values })
    const { values: values_ret } = result

    const values2 = { ...values_ret }

    delete values2[relation_field]

    this.edit_model = Model.init_edit_model({
      res_id: undefined,
      record: {},
      values: { ...values2 }
    })

    return { record: {}, ...result, values: { ...values2 } }
  }

  set_editable(record) {
    console.log('set_editable', record)
    // const Model = this.Model
    // this.edit_model = Model.init_edit_model({
    //   res_id: record.id,
    //   record,
    //   values: {}
    // })

    // // todo: m2m o2m 做处理
    // return { ...record }

    return {}
  }
}

export default {
  Addons,
  Menus,
  Action,
  TreeView,
  FormView,
  X2mTree,
  X2mForm,
  Relation
}
