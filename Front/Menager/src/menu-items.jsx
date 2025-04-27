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
          id: 'transactions-page',
          title: 'Transactions Page',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/transactions'
        },
        {
          id: 'Officer-menagment',
          title: 'Officer Menagment',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/register'
        },
        {
          id: 'loan-management-page',
          title: 'Loan Management Page',
          type: 'item', 
          icon: 'feather icon-sliders',
          url: '/loans'
        },
        {
          id: 'profile-page',
          title: 'Profile',
          type: 'item',
          icon: 'feather icon-user',
          url: '/profile'
        }
      ]
    }
  ]
};

export default menuItems;
