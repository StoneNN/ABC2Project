export default {
  views: {},

  actions: {
    action_contacts: {
      name: '联系人',
      type: 'ir.actions.act_window',
      res_model: 'res.partner',
      // view_mode: ['tree', 'form'],
      domain: [],
      context: {},
      views: {
        tree: 'base.view_partner_tree',
        form: 'base.view_partner_form'
      }
    }
  },

  menus: {
    menu_contacts: {
      name: '联系人',
      sequence: 20
    },

    res_partner_menu_contacts: {
      action: 'action_contacts',
      parent: 'menu_contacts',
      name: '联系人',
      sequence: 2
    },

    res_partner_menu_config: {
      parent: 'menu_contacts',
      name: '配置',
      sequence: 2
    },

    menu_partner_category_form: {
      action: 'base.action_partner_category_form',
      parent: 'res_partner_menu_config',
      name: '联系人标签',
      sequence: 1
    },

    menu_partner_title_contact: {
      action: 'base.action_partner_title_contact',
      parent: 'res_partner_menu_config',
      name: '联系人头衔',
      sequence: 3
    },

    res_partner_industry_menu: {
      action: 'base.res_partner_industry_action',
      parent: 'res_partner_menu_config',
      name: '行业',
      sequence: 5
    },

    menu_localisation: {
      parent: 'res_partner_menu_config',
      name: '本地化',
      sequence: 5
    },

    menu_country_partner: {
      action: 'base.action_country',
      parent: 'menu_localisation',
      name: '国家',
      sequence: 1
    },

    menu_country_group: {
      action: 'base.action_country_group',
      parent: 'menu_localisation',
      name: '国家组',
      sequence: 1
    }
  }
}
