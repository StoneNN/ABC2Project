export default {
  views: {
    view_country_tree: {
      model: 'res.country',
      type: 'tree',
      buttons: { create: false, delete: false },
      fields: {
        name: {},
        code: {}
      }
    },
    view_country_form: {
      model: 'res.country',
      type: 'form',
      buttons: { create: false, edit: true, delete: false },

      fields: {
        display_name: {},
        name: {},
        code: {},
        currency_id: {},
        phone_code: {},
        state_ids: {
          widget: 'x2many_tree',
          views: {
            tree: { fields: { name: {}, code: {} } },
            form: { fields: { display_name: {}, name: {}, code: {} } }
          }
        }
      }
    },

    view_country_group_tree: {
      model: 'res.country.group',
      type: 'tree',
      fields: {
        name: {}
      }
    },
    view_country_group_form: {
      model: 'res.country.group',
      type: 'form',
      fields: {
        name: {},
        country_ids: {
          widget: 'many2many_tags'
        }
      }
    }
  },

  actions: {
    action_country: {
      name: '国家',
      type: 'ir.actions.act_window',
      res_model: 'res.country',
      // view_mode 默认为 ['tree', 'form'],
      // view_mode: ['tree', 'form'],
      domain: [],
      context: {},
      router: '/web/action_country'
      // views, 根据 view_mode 补全. 缺省值为 views中 优先级最高的 view.xml_id
      // views: {
      //   tree: 'view_company_tree',
      //   form: 'view_company_form'
      // }
    },

    action_country_group: {
      name: '国家组',
      type: 'ir.actions.act_window',
      res_model: 'res.country.group',

      domain: [],
      context: {},
      router: '/web/action_country'
      // views, 根据 view_mode 补全. 缺省值为 views中 优先级最高的 view.xml_id
      // views: {
      //   tree: 'view_country_group_tree',
      //   form: 'view_country_group_form'
      // }
    }
  },

  menus: {}
}
