export default {
  views: {
    product_template_tree_view: {
      model: 'product.template',
      type: 'tree',
      priority: 16,
      fields: {
        name: { string: '产品名称' },
        default_code: {},
        detailed_type: {},
        categ_id: {}
      }
    },

    product_template_only_form_view: {
      model: 'product.template',
      type: 'form',
      fields: {
        display_name: {},
        name: {},
        default_code: {},
        detailed_type: {},
        list_price: {},
        tax_string: {},
        categ_id: {}
      }
    },

    view_order_tree: {
      model: 'sale.order',
      type: 'tree',
      priority: 2,
      fields: {
        name: { string: '编号' },
        date_order: { string: '订单日期' },
        amount_total: {},
        state: {}
      }
    },

    view_order_form: {
      model: 'sale.order',
      type: 'form',
      fields: {
        name: { string: '编号' },
        date_order: { string: '订单日期' },
        amount_total: {},
        state: {},
        order_line: {
          widget: 'x2many_tree',
          views: {
            tree: {
              fields: {
                sequence: {},
                name: {},
                product_id: {}
              }
            },

            form: {
              fields: {
                sequence: {},
                name: {},
                product_id: {}
              }
            }
          }
        }
      }
    }
  },

  actions: {
    product_template_action: {
      name: '产品',
      type: 'ir.actions.act_window',
      res_model: 'product.template',
      domain: [],
      context: {}
      // views: {
      //   tree: 'product_template_tree_view',
      //   form: 'product_template_only_form_view'
      // }
    },

    action_quotations_with_onboarding: {
      name: '报价单',
      type: 'ir.actions.act_window',
      res_model: 'sale.order',
      domain: [],
      context: {}
      // views: {
      //   tree: 'view_order_tree',
      //   form: 'view_order_form'
      // }
    }
  },

  menus: {
    sale_menu_root: {
      name: '销售',
      icon: 'shopping',
      theme: 'twoTone',
      sequence: 30
    },

    sale_order_menu: {
      name: '订单',
      parent: 'sale_menu_root',
      sequence: 2
    },

    product_menu_catalog: {
      name: '产品',
      parent: 'sale_menu_root',
      sequence: 4
    },

    menu_product_template_action: {
      action: 'product_template_action',
      parent: 'product_menu_catalog',
      name: '产品',
      sequence: 1
    },

    menu_sale_quotations: {
      action: 'action_quotations_with_onboarding',
      parent: 'sale_order_menu',
      name: '报价单',
      sequence: 1
    }
  }
}
