
import React, { PureComponent } from 'react';
import {connect} from 'react-redux'
import memoizeOne from 'memoize-one'

import CsvTable from './CsvTable'
import CopyToClipboard from '@adamarthurryan/react-copy-to-clipboard'

const mapStateToProps = state => 
  Object.assign(
    {cards: state.cards} 
  )

const mapDispatchToProps = dispatch => ({
})

class EditorialCalendar extends PureComponent {


    state = { rows : [] };

    render() {
        //this is not the right place to do data processing?

        let rows = processCards(this.props.cards)

        return <CopyToClipboard>
          <CsvTable rows={rows}/>
        </CopyToClipboard>
    	
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorialCalendar)



const ED_CAL_LISTS = [
    //	"README",
    //	"Request",
    //	"Pitch",
        "Assigned",
        "In Progress",
        "Ready for Review",
        "In Review",
        "In Copy Editing",
        "Scheduled"
    ].map(str => str.toLowerCase())
    
    const LABEL_README = "Readme"
    const LABEL_PAID_IN_ADVANCE = "Paid in Advance"
    
    function processCardsInternal (cards) {
        //only keep cards in target lists
        cards = cards.filter( ({list}) => list && ED_CAL_LISTS.includes(list.toLowerCase()))
    
        //remove archived cards
        cards = cards.filter( ({isArchived}) => !isArchived)
    
        //remove any cards with the README label
        cards = cards.filter(card => ! card.labels.includes(LABEL_README))
    
        //sort cards by date (secondary) and status (primary)
        //add placeholder dates
        cards.map(card => Object.assign(card, {date: (! card.date || card.date === "null") ? "9999-12-31" : card.date }))
        cards = cards.sort( (a, b) => 
            10000*(ED_CAL_LISTS.indexOf(b.list.toLowerCase()) - ED_CAL_LISTS.indexOf(a.list.toLowerCase())) 
                + a.date.localeCompare(b.date))
        //remove placeholder dates
        cards = cards.map(card => Object.assign(card, {date: (card.date === "9999-12-31") ? "" : card.date }))
        
        const calendarLines = cards.map(card => formatForEdCal(card))
        
        return calendarLines    
    }

    const processCards = memoizeOne(processCardsInternal)
    
    function formatForEdCal({list, title, date, authors, labels, space}) {
        return {date, day:"", goal:"", title, authors:authors, rate_code:"", rate_cm:"", rate_sponsored:"", status:list, content_strategy:space, invoice:labels.includes(LABEL_PAID_IN_ADVANCE)?"Approved in Advance": ""}
    }