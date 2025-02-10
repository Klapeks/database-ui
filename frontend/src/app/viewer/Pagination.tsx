import { FC } from "react";
import styles from './pagination.module.scss';


type PageSelector = number | "+1" | "-1" | "max" | "first";

function pagesTillNow(now: number, max: number, limit: number): PageSelector[] {
    const halfLimit = Math.floor(limit/2);
    const arr: PageSelector[] = [];

    if (max <= limit) {
        for (let i = 1; i <= max; i++) {
            arr.push(i);
        }
        return arr;
    }
    if (now - halfLimit <= 0) {
        for (let i = 1; i <= limit; i++) {
            arr.push(i);
        }
    }
    else if (now - halfLimit + limit > max) {
        for (let i = 0; i < limit; i++) {
            arr.unshift(max-i);
        } 
    }
    else for (let i = 0; i < limit; i++) {
        arr.push(now + i - halfLimit);
    } 
    arr.unshift('first', "-1");
    arr.push("+1", 'max')
    return arr;
}

interface IProps {
    maxPages: number,
    page: number,
    setPage: (page: number) => any,
}

export const Pagination: FC<IProps> = ({ page: currentPage, maxPages, setPage }) => {

    const pagesElements = pagesTillNow(currentPage, maxPages, 10);

    const selectPage = (newPage: PageSelector) => {
        if (newPage === "+1") newPage = currentPage + 1;
        if (newPage === "-1") newPage = currentPage - 1;
        if (typeof newPage == 'number') {
            if (newPage <= 0 || newPage > maxPages) return;
        }
        if (newPage === "max") newPage = maxPages;
        if (newPage === "first") newPage = 1;
        setPage(newPage)
    }

    return (
        <div className={styles.pagination}>
            {pagesElements.map((page) => (
                <div key={page} 
                className={currentPage === page ? "active" : ""} 
                onClick={() => selectPage(page)}>
                    <p>{page === "+1" ? ">" : (
                        page === "-1" ? "<" : (
                        page === "max" ? maxPages : (
                        page === "first" ? 1 : page
                    )))}</p>
                </div>
            ))}
        </div>
    );
}