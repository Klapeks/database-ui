import Swal, { SweetAlertIcon } from "sweetalert2";


export const utils = {

    toast(title: string, icon: SweetAlertIcon, args?: { 
        timer?: number, html?: string, customClass?: string 
    }) {
        Swal.fire({
            customClass: {
                popup: args?.customClass
            },
            toast: true,
            position: 'top-right',
            timer: args?.timer || 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            icon, title,
            html: args?.html
        })
    },

    replaceAll(string: string, from: string, to: string): string {
        while (string.includes(from)) {
            // console.log("._.", string, '||', from, '||', to);
            string = string.replace(from, to);
        }
        return string;
    },

    sqlTime(date: Date) {
        // '2025-03-05 20:22:48.628000'
        return [
            date.getFullYear(), '-',
            (date.getMonth() + 1).toString().padStart(2, '0'), '-',
            date.getDate().toString().padStart(2, '0'), ' ',
            date.getHours().toString().padStart(2, '0'), ':',
            date.getMinutes().toString().padStart(2, '0'), ':',
            date.getSeconds().toString().padStart(2, '0'), '.',
            (date.getMilliseconds() | 0).toString().padStart(3, '0'), '000',
        ].join('');
    }
}