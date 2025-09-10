import Swal from "sweetalert2";

const domUtils = {
    swalError(error: any) {
        return Swal.fire('Помилка', domUtils.errorOf(error), 'error');
    },
    errorOf(err: any, defaultMsg?: string): string {
        if (err.networkError) {
            const msg = err.networkError?.result?.errors[0]?.message;
            console.log('network error', msg);
            if (msg) return msg;
        }
        if (err.response) {
            if (err.response.data) {
                err = err.response.data;
            } else if (err.response.statusText) {
                err = err.response.statusText;
            }
        }
        if (Array.isArray(err)) err = err[0];
        if (typeof err === "string") return err;
        if (err.message) return err.message;
        if (err.error) return err.error;
        if (defaultMsg) return defaultMsg;
        return JSON.stringify(err);
    },
};

// document.addEventListener('click', (e) => {
//     domUtils.firstClickArray.forEach(c => c(e));
//     domUtils.firstClickArray.length = 0;
// })

export default domUtils;