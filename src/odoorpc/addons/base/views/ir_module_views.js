export default {
  views: {
    module_tree: {
      model: 'ir.module.module',
      type: 'tree',
      buttons: { create: false },
      fields: {
        name: {},
        shortdesc: {},
        author: {},
        installed_version: {},
        state: {},
        category_id: {},
        website: {}
      }
    },
    module_form: {
      model: 'ir.module.module',
      type: 'form',
      buttons: { create: false, edit: false },
      fields: {
        display_name: {},
        name: {},
        shortdesc: {},
        author: {},
        website: {},
        installed_version: {},
        state: {}
      }
    }
  },

  actions: {
    open_module_tree: {
      name: '用户',
      type: 'ir.actions.act_window',
      res_model: 'ir.module.module',
      //   view_mode: ['tree', 'form'],
      domain: [],
      context: {}
      //   views: {
      //     tree: 'module_tree',
      //     form: 'module_form'
      //   }
    }
  },

  menus: {
    menu_apps: {
      parent: 'menu_management',
      name: '模块',
      sequence: 5
    },
    menu_module_tree: {
      action: 'open_module_tree',
      parent: 'menu_apps',
      name: '主要模块',
      sequence: 5
    }
  }
}
