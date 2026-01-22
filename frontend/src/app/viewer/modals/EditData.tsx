import { runSQL } from "@/app/api";
import domUtils from "@/utils/dom.utils";
import { ReactSwal } from "@/utils/sweet.alert"
import { utils } from "@/utils/utils";
import { FC, useEffect, useState } from "react";
import Swal from "sweetalert2";

interface EditDataOptions {
    database: string,
    table: string,
    tableSchema: any[],
    data: any,
}
const KNOWN_TYPES = [
    'bigint', 'int', 'float', 'double', 'tinyint',
    'varchar', 'datetime'
];

// const datetime = (date: Date | string | number | undefined | null): string => {
//     if (!date) return '';
//     date = new Date();
//     return [
//         date.getFullYear(), '-',
//         (date.getMonth() + 1).toString().padStart(2, '0'), '-',
//         date.getDate().toString().padStart(2, '0'), 'T',
//         date.getHours().toString().padStart(2, '0'), ':',
//         date.getMinutes().toString().padStart(2, '0')
//     ].join('');
// }

const SimpleInput: FC<{
    id: string,
    dataType: string,
    value: any,
    nullable: boolean
}> = ({ id, dataType, value, nullable }) => {

    const [ isNull, setNull ] = useState(nullable ? value === null : false);

    if (isNull) {
        return (
            <>
                <input id={id} type="hidden" data-sql-type="null" />
                <p>NULL</p>
                <button onClick={() => setNull(false)}>Edit</button>
            </>
        );
    }

    return (
        <>
            { dataType === 'bigint' ? <input id={id} type="number" defaultValue={value} data-sql-type="number"/> : null }
            { dataType === 'int' ? <input id={id} type="number" defaultValue={value} data-sql-type="number"/> : null }
            { dataType === 'tinyint' ? <input id={id} type="number" defaultValue={value} data-sql-type="number"/> : null }
            { dataType === 'float' ? <input id={id} type="number" defaultValue={value} data-sql-type="number"/> : null }
            { dataType === 'double' ? <input id={id} type="number" defaultValue={value} data-sql-type="number"/> : null }

            { dataType === 'varchar' ? <input id={id} type="text" defaultValue={value} data-sql-type="string"/> : null }
            { dataType === 'datetime' ? <input id={id} type="text" defaultValue={value} data-sql-type="datetime" style={{ minWidth: '200px' }}/> : null }
            {/* { dataType === 'datetime' ? <input id={id} type="datetime-local" defaultValue={datetime(value)}/> : null } */}
            { nullable ? <button onClick={() => setNull(true)}>Set NULL</button> : null }
        </>
    )
}

const DataInput: FC<{
    schema: any,
    value: any
}> = ({ schema, value }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '5px'
        }}>
            { !KNOWN_TYPES.includes(schema.DATA_TYPE) ? `UNKNOWN_DATA_TYPE | ${value}` : null }
            <SimpleInput dataType={schema.DATA_TYPE} id={schema.COLUMN_NAME} value={value} 
            nullable={schema.IS_NULLABLE && schema.IS_NULLABLE != 'NO'}/>
        </div>
    )
}

const EditDataComponent: FC<{ options: EditDataOptions }> = ({ options }) => {
    const { database, table, tableSchema, data } = options;
    return (
        <div style={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: "flex-start",
            justifyContent: "flex-start",
        }}>
            <div>
                <p>Database: { database }</p>
                <p>Table: { table }</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th> </th>
                        <th> </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {tableSchema.map(t => (
                        <tr key={t.COLUMN_NAME} className="column-name">
                            {/* fields */}
                            <td style={{ paddingRight: '5px' }}>
                                <p style={{
                                    textAlign: 'end'
                                }}>{
                                    t.COLUMN_KEY == 'PRI' ? 
                                    <span style={{ fontSize: '12px' }}>🔑</span>
                                    : null
                                } {t.COLUMN_NAME}: </p>
                            </td>

                            {/* values */}
                            <td>
                                <DataInput schema={t} value={data[t.COLUMN_NAME]} />
                            </td>
                            <td style={{ paddingLeft: '10px' }}>
                                <p className="type">{t.COLUMN_TYPE}{t.IS_NULLABLE && t.IS_NULLABLE != 'NO' ? '?' : ''}</p>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <pre>{ JSON.stringify(data, undefined, 4) }</pre> */}
        </div>
    );
}

const convertDataToSQL = (data: any, type: 'string' | 'datetime') => {
    if (type === 'datetime') {
        return "'" + utils.sqlTime(new Date(data)) + "'";
    }
    data = data.toString();
    const APOSTRAF = "(<<<!!!!TUT_BUDET_" + Math.random() + "APOSTRAF!!!!>>>)";
    data = utils.replaceAll(data, "'", APOSTRAF);
    data = utils.replaceAll(data, APOSTRAF, "\\'");
    return "'" + data + "'";
}

export const fireEditDataModal = async (options: EditDataOptions) => {
    console.log("table schema:", options.tableSchema)
    return ReactSwal.fire({
        title: <p>Edit data</p>,
        html: <EditDataComponent options={options} />,

        width: 'auto',

        confirmButtonColor: "green",
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        showCancelButton: true,
        showConfirmButton: true
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        const html = ReactSwal.getHtmlContainer() as HTMLDivElement;

        const getInput = (id: string) => {
            if (!html) return;
            return html?.querySelector("input#" + id) as HTMLInputElement;
        }
        const getInputValueAsSQL = (id: string, column: any) => {
            const input = getInput(id);
            if (!input) return undefined;
            const datatype = input.getAttribute('data-sql-type');
            if (datatype === 'null') return 'NULL';
            if (datatype === 'number') return Number(input.value);
            if (datatype === 'datetime') return convertDataToSQL(input.value, 'datetime');
            return convertDataToSQL(input.value, 'string');
        }

        const newObject = {} as any;
        const where = {} as any;
        for (let t of options.tableSchema) {
            newObject[t.COLUMN_NAME] = getInputValueAsSQL(t.COLUMN_NAME, t);
            if (typeof newObject[t.COLUMN_NAME] === undefined) {
                delete newObject[t.COLUMN_NAME];
                continue;
            }
            if (t.COLUMN_KEY == 'PRI') {
                let d_5 = options.data[t.COLUMN_NAME];
                if (typeof d_5 === 'object') {
                    d_5 = JSON.stringify(d_5);
                }
                where[t.COLUMN_NAME] = convertDataToSQL(d_5, 'string');
            }
        }
        console.log('------ 1 ------');
        console.log('newObject:', newObject);
        console.log('where:', where);
        console.log('------ 2 ------');

        if (!Object.keys(where).length) throw "No PK :(";
        let sql = '';

        for (let key of Object.keys(newObject)) {
            sql += ', `' + key + '` = ' + newObject[key];
        }

        sql = `UPDATE \`${options.database}\`.\`${options.table}\` SET` + sql.substring(1);
        sql += ' WHERE ' + Object.keys(where).map((key) => `\`${key}\` = ${where[key]}`).join(' AND ');

        sql += ';'
        await runSQL(sql);
        utils.toast('Success', 'success');
    }).catch(err => {
        domUtils.swalError(err);
    });
}