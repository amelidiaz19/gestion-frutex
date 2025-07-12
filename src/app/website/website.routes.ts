export default [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
    },
];
