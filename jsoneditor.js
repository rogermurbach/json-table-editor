var counter_id;

var parent_clicked_row;
var parent_clicked_col;
var parent_counter_id;

var gbl_table_container_id;
var gbl_json_input_container_id;
var gbl_json_output_container_id;
var gbl_json_to_table_btn_id;
var gbl_table_to_json_btn_id;

var copied_row;
var copied_column;

var max_counter = 0

var obj_clicked_row = {};
var obj_clicked_col = {};

function jsonEditorInit(table_container_id, json_input_container_id, json_output_container_id, json_to_table_btn_id, table_to_json_btn_id) {
    
    gbl_table_container_id = table_container_id;
    gbl_json_input_container_id = json_input_container_id;
    gbl_json_output_container_id = json_output_container_id;
    gbl_json_to_table_btn_id = json_to_table_btn_id;
    gbl_table_to_json_btn_id  =table_to_json_btn_id;

    $('#' + table_to_json_btn_id).on('click', function(){
        if ( $('#' + json_output_container_id ).is( "input" ) ) {	
            $('#' + json_output_container_id ).val(JSON.stringify(makeJson()));
            //$('#' + response ).val("Valid");
            alert("JSON Valido 1");
        }
        else{
        var output_json = JSON.stringify(makeJson());
        $('#' + json_output_container_id ).html(output_json);
        console.log(JSON.stringify(output_json));
        //$('#' + response ).html("Valid");
        alert("JSON Valido ");
        }
    });

    $('#' + json_to_table_btn_id).on('click', function(){

        try {
            var value = $('#' + json_input_container_id).val().trim();
            json_arr = JSON.parse(value != "" ? value : "[{\" \":\" \"}]");
        } catch(e) {
            alert(e);
            return;
        }

        $('#' + table_container_id ).html(makeTable(json_arr));
        $('.json_table').addClass('table table-bordered table-striped table-hover table-sm');
        $('.json_table thead').addClass('thead-dark');

    });
}

$(function() {
    $.contextMenu({
        selector: '#json_table_1', 
        callback: function(key, options) {

            clicked_col = obj_clicked_col[counter_id];
            clicked_row = obj_clicked_row[counter_id];

        switch(key){   

            case 'insertCR':

                var col_heading = prompt("Digite o cabeçalho da nova coluna");
                $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).each(function(){
                    
                    new_th = `<th counter-id=${counter_id}><div contenteditable=true>`+ col_heading +'</div></th>'
                    new_td = `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`; 

                    $(this).find(`th[counter-id=${counter_id}]`).eq(clicked_col).after(new_th);
                    $(this).find(`td[counter-id=${counter_id}]`).eq(clicked_col).after(new_td);

                });
            break;

            case 'insertCL':
                var col_heading = prompt("Digite o cabeçalho da nova coluna");
                $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).each(function(){
                    new_th = `<th counter-id=${counter_id}><div contenteditable=true>`+ col_heading +'</div></th>'
                    new_td = `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`; 

                    $(this).find(`th[counter-id=${counter_id}]`).eq(clicked_col).before(new_th);
                    $(this).find(`td[counter-id=${counter_id}]`).eq(clicked_col).before(new_td);
                });
                break;

            case 'deleteC':
                $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).each(function(){
                    $(this).find(`th[counter-id=${counter_id}]`).eq(clicked_col).remove();
                    $(this).find(`td[counter-id=${counter_id}]`).eq(clicked_col).remove();
                });
                break;

            case 'insertRD':
                td_length = $(`#json_table_${counter_id} tr[counter-id=${counter_id}] th[counter-id=${counter_id}]`).length;
                new_tr = `<tr counter-id=${counter_id}>` + `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`.repeat(td_length) + "</tr>" ;     
                $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).after(new_tr);
                break;

            case 'insertRU':
                td_length = $(`#json_table_${counter_id} tr[counter-id=${counter_id}] th[counter-id=${counter_id}]`).length;
                new_tr = `<tr counter-id=${counter_id}>` + `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`.repeat(td_length) + "</tr>" ;     
                $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).before(new_tr);
                break;

            case 'deleteR':
                $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).remove();
                break;

            case 'deleteT':
                $(`#json_table_${counter_id}`).remove();
                cell = $(`#json_table_${parent_counter_id} tr[counter-id=${parent_counter_id}]`).eq(parent_clicked_row+1).find(`td[counter-id=${parent_counter_id}]`).eq(parent_clicked_col)
                $(cell).html('<div contenteditable="true"></div>');
                $(cell).attr('td_attr','value');
                break;

            case 'copyRow':
                copied_row = $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).clone();
                break;

            case 'pasteRow':
                var inner_tables = $(copied_row).find('td table');
                var inner_table_count = $(inner_tables).length;
                var  i = 0;
                for(i=0;i<inner_table_count; i++){
                    var t = inner_tables[i].outerHTML;
                    updated_table = update_table_id(t, max_counter++);
                    $(inner_tables[i].parentNode).html(updated_table);
                }
                //use $().each(function(){}); here

                $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).after(copied_row[0].outerHTML);
                break;

            case 'addT':
                addTable();
                break;
        }  

        },
        items: {
            "insertCR": {name: "Inserir coluna a direita", icon: "fas fa-arrow-right"},
            "insertCL": {name: "Inserir coluna a esquerda", icon: "fas fa-arrow-left"},
            "deleteC": {name: "Apagar esta coluna", icon: "fas fa-trash-alt"},
            "sep1": "---------",
            "insertRD": {name: "Inserir linha abaixo desta célula", icon: "fas fa-arrow-down"},
            "insertRU": {name: "Inserir linha acima desta célula", icon: "fas fa-arrow-up"},
            "deleteR": {name: "Apagar esta linha", icon: "fas fa-trash-alt"},
            "sep2": "---------",
            "addT": {name: "Adicionar uma nova tabela nesta célula", icon: "fas fa-plus"},
            "deleteT": {name: "Apagar tabela pai da célula selecionada", icon: "fas fa-trash-alt"},
            "sep3": "---------",
            "copyRow": {name: "Copiar linha atual", icon: "fas fa-arrows-alt-h"},
            "pasteRow": {name: "Inserir linha copiada", icon: "fas fa-arrows-alt-h"},
        }
    });

    /*
    $(document).on('contextmenu', "#json_table_1 td,th", function(e){

            counter_id = $(e.target).closest("tr").attr("counter-id");
            current_counter_id = $(e.currentTarget).attr("counter-id")
            obj_clicked_col[current_counter_id] = $(this).index();
            obj_clicked_row[current_counter_id] = $(this).closest('tr').index();

            console.log('target:', e.target);
            
            console.log('Col: ' + obj_clicked_col[current_counter_id]);
            console.log('Row: ' + obj_clicked_row[current_counter_id]);
            console.log('Counter id: '+counter_id);
            console.log("table depth: " + $(this).parents('table').length);

    }); 
    */
});

function jsonToTable(table_container_id, json_input_data) {
        try {
            var value = json_input_data.trim();
            json_arr = JSON.parse(value != "" ? value : "[{\" \":\" \"}]");
        } catch(e) {
            alert(e);
            return;
        }

        $('#' + table_container_id ).html(makeTable(json_arr,1,table_container_id));
        $('.json_table').addClass('table table-bordered table-striped table-hover table-sm');
        $('.json_table thead').addClass('thead-dark');
}

function tableToJson(table_container_id) {
    return JSON.stringify(makeJson(table_container_id));
}

function update_table_id(table_string, max_counter){

    var pos1, pos2;
    var id;
    var new_table_string;

    pos1 = table_string.indexOf('counter-id="');
    pos2 = table_string.indexOf('id="json_table');

    id_string = table_string.substring(pos1, pos2-1)

    pos1 = id_string.indexOf('"');
    pos2 = id_string.lastIndexOf('"');

    id = id_string.substring(pos1+1,pos2)

    new_table_string = table_string.replace(new RegExp(id_string, 'g'), `counter-id="${max_counter+1}"`)
    new_table_string = new_table_string.replace(new RegExp('"json_table_header_' + id + '"', 'g'), `"json_table_header_${max_counter+1}"`)
    new_table_string = new_table_string.replace(new RegExp('"json_table_body_' + id + '"', 'g'), `"json_table_body_${max_counter+1}"`)
    new_table_string = new_table_string.replace(new RegExp('"json_table_' + id + '"', 'g'), `"json_table_${max_counter+1}"`)

    return new_table_string;

}

function addTable(){

    clicked_col = obj_clicked_col[counter_id];
    clicked_row = obj_clicked_row[counter_id];

    max_counter++;
    
    table_template =`<table class = "json_table" counter-id="${max_counter}" id="json_table_${max_counter}">
                        <thead counter-id="${max_counter}" id="json_table_header_${max_counter}">
                            <tr counter-id="${max_counter}">
                                <th counter-id="${max_counter}"> <div contenteditable=true> id </div> </th>
                            </tr>
                        </thead>
                        <tbody counter-id="${max_counter}" id="json_table_body_${max_counter}">
                            <tr counter-id="${max_counter}">
                                <td counter-id="${max_counter}" td_attr="value">
                                    <div contenteditable="true">1</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>`;

    cell = $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).find(`td[counter-id=${counter_id}]`).eq(clicked_col)
    $(cell).html(table_template);
    $(cell).attr('td_attr','array');

    $(`#json_table_${max_counter}`).addClass('table table-bordered table-striped table-hover table-sm');
    $(`#json_table_${max_counter} thead[counter-id=${max_counter}]`).addClass('thead-dark');

}


//Function takes a json object as input containing the string to be converted to the table and returns the converted string formatted as an html table.
function makeTable(obj_for_table, counter = 1, lid='start'){

    var table_html = jQuery.parseHTML( `<table class = "json_table" lid = ${lid} id = "json_table_${lid}"></table>` );
    var i= 0;
    var j= 0;
    var header_names = {};
    var local_counter = counter;

    var header_names_l1 = {};

    var td_attr;

    var proc_l1 = false;
    $.each(obj_for_table, function(level1_k, level1_v){
        var l1v_type = jQuery.type(level1_v);
        console.log('First Level: ' , level1_k, level1_v,jQuery.type(level1_v));
        if((l1v_type!='object') && (l1v_type!='array')) {
            value = "<div contenteditable=true>" + level1_v + "</div>";
            td_attr = 'value';

            if(typeof(header_names_l1[level1_k]) == "undefined" ){
                header_names_l1[level1_k] = j;
                insertColumn(table_html, level1_k, local_counter, "f"+local_counter);
                j++;
            }

            var cell = $(table_html).find('tr[lid="f' + local_counter + '"]').last().find('td[lid="f' + local_counter + '"]').eq(header_names_l1[level1_k]);
            $(cell).attr('td_attr',td_attr);
            //$(cell).attr('counter-id',local_counter);  //counter id at cell level
            $(cell).html(value);  

            proc_l1=true;

        } else if((jQuery.type(level1_k)=='string') && (l1v_type=='array')) {
            value = makeTable( level1_v, counter+1 , Date.now() );
            counter++;
            max_counter = counter;
            td_attr = 'array';

            if(typeof(header_names_l1[level1_k]) == "undefined" ){
                header_names_l1[level1_k] = j;
                insertColumn(table_html, level1_k, local_counter, "f"+local_counter);
                j++;
            }

            var cell = $(table_html).find('tr[lid="f' + local_counter + '"]').last().find('td[lid="f' + local_counter + '"]').eq(header_names_l1[level1_k]);
            $(cell).attr('td_attr',td_attr);
            //$(cell).attr('counter-id',local_counter);  //counter id at cell level
            $(cell).html(value);  

            proc_l1=true;

        } else {
            $.each(level1_v, function(k, v){
                console.log('Second Level: ' , k, v, jQuery.type(v));
                if(jQuery.type(v) == 'object'){
                    
                    value = makeTable( JSON.parse(  "[" + JSON.stringify(v) + "]" ), counter+1  , Date.now() );
                    counter++;
                    max_counter = counter;
                    td_attr = 'obj';
                }
                else if(jQuery.type(v) == 'array'){
                    value = makeTable( v, counter+1, Date.now() );
                    counter++;
                    max_counter = counter;
                    td_attr = 'array';
                }
                else
                {
                    value = "<div contenteditable=true>" + v + "</div>";
                    td_attr = 'value';
                }

                if(typeof(header_names[k]) == "undefined" ){
                    header_names[k] = i;
                    insertColumn(table_html, k, local_counter, "s"+local_counter);
                    i++;
                }

                var cell = $(table_html).find('tr[lid="s' + local_counter + '"]').last().find('td[lid="s' + local_counter + '"]').eq(header_names[k]);
                $(cell).attr('td_attr',td_attr);
                //$(cell).attr('counter-id',local_counter);  //counter id at cell level
                $(cell).html(value);  

            });
            td_list = `<td lid = s${local_counter}><div contenteditable=true></div></td>`.repeat(i); //counter id at cell level
            $(table_html).append( `<tr lid = s${local_counter}>' ${td_list} '</tr>`);
        }
//            td_list = `<td counter-id = ${local_counter}><div contenteditable=true></div></td>`.repeat(i); //counter id at cell level
//            $(table_html).append( `<tr counter-id = ${local_counter}>' ${td_list} '</tr>`);
    });
    if(proc_l1) {
        td_list = `<td lid = f${local_counter}><div contenteditable=true></div></td>`.repeat(j); //counter id at cell level
        $(table_html).append( `<tr lid = f${local_counter}>' ${td_list} '</tr>`);            
    }

    $(table_html).find('tr').last().remove();
    
    $(table_html).find('td').each(function(td_i,td_v){
        if($(td_v).attr('td_attr') == undefined){
            $(td_v).attr('td_attr','value');
        }
    });
    
    return table_html;

}   

//If the code finds any new column in JSON string, the below function will be used to insert the column in the table
function insertColumn(table_ref, header_name, counter, lid) {

    if( !$(table_ref).find('tr[lid="' + lid + '"]').first().length ){
        //var thead = `<thead  counter-id = ${counter} id = "json_table_header_${counter}"><tr counter-id = ${counter}><th><div contenteditable=true> ${header_name} </div></th></tr></thead>`;
        //var tbody = `<tbody  counter-id = ${counter} id = "json_table_body_${counter}"><tr counter-id = ${counter}><td><div contenteditable=true></div></td></tr></tbody>`;
        if(jQuery.type(header_name)=='number') {
            var thead = `<thead   lid = ${lid} id = "json_table_header_${lid}"><tr lid = ${lid}><th lid = ${lid}> <div contenteditable=false> ${header_name} </div> </th></tr></thead>`; //counter id at cell level
        } else {
            var thead = `<thead  lid = ${lid} id = "json_table_header_${lid}"><tr lid = ${lid}><th lid = ${lid}> <div contenteditable=false> ${header_name} </div> </th></tr></thead>`; //counter id at cell level
        }        
        var tbody = `<tbody lid = ${lid} id = "json_table_body_${lid}"><tr lid = ${lid}><td lid = ${lid}><div contenteditable=true></div></td></tr></tbody>` //counter id at cell level
        
        $(table_ref).append(thead);
        $(table_ref).append(tbody);
    }

    else
    {
        $(table_ref).find('tr[lid="' + lid + '"]').each(function(){
            //$(this).append('<td><div contenteditable=true></div></td>');
            $(this).append(`<td lid = ${lid} ><div contenteditable=true></div></td>`); //counter id at cell level
        })
    }
    var inserted_td = $(table_ref).find('tr[lid="' + lid + '"]').first().find('td[lid="' + lid + '"]').last();

    $(inserted_td).html(header_name);
    //$(inserted_td).replaceWith('<th>' + $(inserted_td).html() + '</th>');
    $(inserted_td).replaceWith(`<th lid = ${lid}><div contenteditable=true>` + $(inserted_td).html() + `</div></th>`); //counter id at cell level

}


function makeJson(lid='start',parent='obj'){

    var header = [];
    var data = [];

    var table = '#json_table_'+lid;
    lid = $(table).find('thead').first().attr('id').split('_')[3];
    
    $(table + ' #json_table_header_'+ lid + ' th').each(function(i, v){
        header[i] = $(this).text().trim();
    });
    //console.log('header: ', header, counter);
    var row_finder = `${table} #json_table_body_${lid} tr[lid=${lid}]`;
    $(row_finder).each(function(row_i, row_v){

        var isArr=false;
        var arr = [];
        var obj = {};
        //console.log('Outer loop id, value: ', row_i, row_v);

        $(header).each(function(header_i, header_value){

            var cell = $(row_v).children('td').eq(header_i);
            var td_attr = $(cell).attr('td_attr');
            var inner_text = $(cell).children('div').text().trim();
            var inner_table = $(cell).find('table');

            if((parent=='array') && (header_value==Number(header_value).toString())) {
                isArr = true;
            }

            switch(td_attr){
                case 'value':
                    if(inner_text != "" && inner_text != null ) {
                        if(inner_text==Number(inner_text).toString()) {
                            val = Number(inner_text);
                        } else {
                            val = inner_text;
                        }
                        if(isArr) {
                            arr.push(val);
                        } else {
                            obj[header_value] = val;
                        }
                    }
                    //else                              //Uncomment it if the null values to be treated as blanks (while converting the table to json)
                    //    obj[header_value] = '';  
                break;

                case 'obj':
                case 'array':
                obj[header_value] = makeJson( $(inner_table).attr('lid'), td_attr);
                break;

                case null:
                case '':
                case undefined:

                break;

                default:
                obj[header_value] = "unknown value";
                break;
            }
            //console.log('value of td_attr: ', td_attr);
            
        });
        //console.log('data value: ', data);
        if(isArr) {
            data.push(arr);
        } else {
            data.push(obj);
        }
    });

    if(data.length==1) {
        return data[0];
    }
    //return JSON.stringify(data);
    return data;
}

