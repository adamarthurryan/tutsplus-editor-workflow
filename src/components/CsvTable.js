
import React, { PureComponent } from 'react';

class CsvTable extends PureComponent {
    
    render() {
        if (this.props.rows.length <= 0)
            return <div></div>
        const fields = Object.keys(this.props.rows[0])
        return <div style={{height:"500px", overflowX:"scroll"}}><table className="ui table" >
            <thead>
                <tr>
                    {fields.map(field => <th key={field}>{field}</th>)}
                </tr>
            </thead>
            <tbody>
                {this.props.rows.map((row, index) => <tr key={index}>
                    {fields.map(field => <td key={`${index}-${field}`}>
                        {row[field] ? row[field] : '\u00A0' }
                    </td>)}
                </tr>)}
            </tbody>
        </table>
        </div>
    }
}

export default CsvTable