export default {
  views: {
    view_company_tree: {
      model: 'res.company',
      type: 'tree',
      fields: {
        name: {},
        partner_id: {}
      }
    },
    view_company_form: {
      model: 'res.company',
      type: 'form',
      fields: {
        display_name: {},
        name: {},
        partner_id: {},
        company_registry: {}
      }
    }
  },

  actions: {
    action_res_company_form: {
      name: '公司',
      type: 'ir.actions.act_window',
      res_model: 'res.company',
      view_mode: ['tree', 'form'],
      domain: [],
      context: {}
      // views: {
      //   tree: 'view_company_tree',
      //   form: 'view_company_form'
      // }
    }
  },

  menus: {
    menu_action_res_company_form: {
      action: 'action_res_company_form',
      parent: 'menu_users',
      name: '公司',
      sequence: 1
    }
  }
}
