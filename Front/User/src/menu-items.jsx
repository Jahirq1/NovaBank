

const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        },
        {
          id: 'Transactions',
          title: 'Transactions',
          type: 'item',
          url: '/transactions',
          icon: 'feather icon-credit-card'
        },
        {
          id: 'balance',
          title: 'Balance',
          type: 'item',
          url: '/balance', // This must match your route path
          icon: 'fa-wallet',
          breadcrumbs: false
        },
        {
          id: 'profile',
          title: 'Profile',
          type: 'item',
          url: '/profile',
          icon: 'feather icon-user',
          breadcrumbs: false
        }
      ]
    },
   
  ]
};

export default menuItems;
