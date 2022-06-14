export default {
  views: {
    view_partner_tree: {
      model: 'res.partner',
      type: 'tree',
      fields: {
        display_name: {},
        type: {},
        email: {},
        company_id: {}
      }
    },
    view_partner_form: {
      model: 'res.partner',
      type: 'form',
      fields: {
        display_name: {},
        type: {},
        name: {},
        email: {},
        company_id: {},
        category_id: {
          widget: 'many2many_tags'
        }
      }
    },

    view_partner_category_list: {
      model: 'res.partner.category',
      type: 'tree',
      fields: {
        display_name: {},
        name: {},
        parent_id: {},
        color: {}
      }
    },
    view_partner_category_form: {
      model: 'res.partner.category',
      type: 'form',
      fields: {
        // display_name: {},
        active: {},
        name: {},
        parent_id: {},
        color: {}
      }
    },

    view_partner_title_tree: {
      model: 'res.partner.title',
      type: 'tree',
      fields: {
        name: {},
        shortcut: {}
      }
    },
    view_partner_title_form: {
      model: 'res.partner.title',
      type: 'form',
      fields: {
        name: {},
        shortcut: {}
      }
    },
    res_partner_industry_view_tree: {
      model: 'res.partner.industry',
      type: 'tree',
      fields: {
        name: {},
        full_name: {},
        active: {}
      }
    },
    res_partner_industry_view_form: {
      model: 'res.partner.industry',
      type: 'form',
      fields: {
        name: {},
        full_name: {},
        active: {}
      }
    }
  },

  actions: {
    action_partner_category_form: {
      name: '联系人标签',
      type: 'ir.actions.act_window',
      res_model: 'res.partner.category',
      // view_mode: ['tree', 'form'],
      domain: [],
      context: {}
      // views: {
      //   tree: 'view_partner_category_list',
      //   form: 'view_partner_category_form'
      // }
    },

    action_partner_title_contact: {
      name: '联系人头衔',
      type: 'ir.actions.act_window',
      res_model: 'res.partner.title',
      // view_mode: ['tree', 'form'],
      domain: [],
      context: {}
      // views: {
      //   tree: 'view_partner_title_tree',
      //   form: 'view_partner_title_form'
      // }
    },
    res_partner_industry_action: {
      name: '行业',
      type: 'ir.actions.act_window',
      res_model: 'res.partner.industry',
      // view_mode: ['tree', 'form'],
      domain: [],
      context: {}
      // views: {
      //   tree: 'res_partner_industry_view_tree',
      //   form: 'view_partner_title_form'
      // }
    }
  },

  menus: {}
}
