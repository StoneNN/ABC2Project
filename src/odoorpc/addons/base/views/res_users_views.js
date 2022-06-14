export default {
  views: {
    view_users_tree: {
      model: 'res.users',
      type: 'tree',
      fields: {
        name: {},
        login: {},
        lang: {},
        login_date: {},
        company_id: {}
      }
    },
    view_users_form: {
      model: 'res.users',
      type: 'form',
      fields: {
        display_name: {},
        name: {},
        login: {},
        lang: {},
        login_date: {},
        company_id: {}
      }
    }
  },

  actions: {
    action_res_users: {
      name: '用户',
      type: 'ir.actions.act_window',
      res_model: 'res.users',
      //   view_mode: ['tree', 'form'],
      domain: [],
      context: {},
      views: {
        tree: 'view_users_tree',
        form: 'view_users_form'
      }
    }
  },

  menus: {
    menu_action_res_users: {
      action: 'action_res_users',
      parent: 'menu_users',
      name: '用户',
      sequence: 0
    }
  }
}
