import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';

import dataTableButtons from 'datatables.net-buttons-bs'

import html5ExportButtons from 'datatables.net-buttons/js/buttons.html5';
import flashExportButtons from 'datatables.net-buttons/js/buttons.flash';
import printButton from 'datatables.net-buttons/js/buttons.print';

Template.registerHelper('toFixed', function(x, decimals){
    return parseFloat(x).toFixed(decimals);
});

Meteor.startup(()=> {
    $.material.init();
    dataTablesBootstrap(window, $);
    //dataTableButtons(window, $);
    //html5ExportButtons(window, $);
    //flashExportButtons(window, $);
    //printButton(window, $);
    $.extend(true, $.fn.dataTable.defaults, {
        language: {
            "processing": "Подождите...",
            "search": "Поиск:",
            "lengthMenu": "Показать _MENU_ записей",
            "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
            "infoEmpty": "Записи с 0 до 0 из 0 записей",
            "infoFiltered": "(отфильтровано из _MAX_ записей)",
            "infoPostFix": "",
            "loadingRecords": "Загрузка записей...",
            "zeroRecords": "Записи отсутствуют.",
            "emptyTable": "В таблице отсутствуют данные",
            "paginate": {
                "first": "Первая",
                "previous": "Предыдущая",
                "next": "Следующая",
                "last": "Последняя"
            },
            "aria": {
                "sortAscending": ": активировать для сортировки столбца по возрастанию",
                "sortDescending": ": активировать для сортировки столбца по убыванию"
            }
        },
        dom:
        "<'row'<'col-sm-6'l><'col-sm-6'<'html5buttons'B>f>>" +
        "<'row'<'col-sm-12 table-responsive no-padding'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    });
});
