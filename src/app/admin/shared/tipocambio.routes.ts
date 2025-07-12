export default [
    {
        path: '',
        loadComponent: () => import('../../admin/components/tipo-cambio/tipo-cambio.component').then(c => c.TipoCambioComponent)
    },
];