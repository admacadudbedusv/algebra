var urlBase = "";
var urlNotificacionesNoVistas = "";
var urlNotificacionesNoEjecutadas = "";
const cookieAccesoName = "__RequestVerificationTokenUDB";

function inicializar(
  urlBase,
  urlNotificaciones,
  urlNotificacionesNoVistas,
  urlNotificacionesNoEjecutadas
) {
  this.urlBase = urlBase;
  this.urlNotificacionesNoVistas = urlNotificacionesNoVistas;
  this.urlNotificacionesNoEjecutadas = urlNotificacionesNoEjecutadas;
  setBadges(urlNotificaciones);
  inicializarChosen();
  $(".chosen-select").chosen({
    width: "100%",
    no_results_text: "No se encontraron resultados!",
    placeholder_text_multiple: "Seleccione al menos una opción",
  });
  $(".chosen-select-modal").chosen({
    width: "100%",
    no_results_text: "No se encontraron resultados!",
    placeholder_text_multiple: "Seleccione al menos una opción",
  });
  $('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();
  //Inicio datatable notificaciones
  dataTableNotificacionesRecibidas();
  dataTableNotificacionesPendientes();

  inicializarControlesBS5();
  $("#footer-udb-logos").load(urlRepositorio + "html/footer.html");
  cargarScrollUp();
  dimensionarBotones();
}

function inicializarSinParametros() {
  inicializarChosen();
  $(".chosen-select").chosen({
    width: "100%",
    no_results_text: "No se encontraron resultados!",
    placeholder_text_multiple: "Seleccione al menos una opción",
  });
  $(".chosen-select-modal").chosen({
    width: "100%",
    no_results_text: "No se encontraron resultados!",
    placeholder_text_multiple: "Seleccione al menos una opción",
  });
  $('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();

  inicializarControlesBS5();

  $("#footer-udb-logos").load(urlRepositorio + "html/footer.html");
  cargarScrollUp();
  dimensionarBotones();
}

function dataTableNotificacionesRecibidas() {
  inicializarDataTable("#tNotificacionesRM", 10, false, false, false);
}

function dataTableNotificacionesPendientes() {
  inicializarDataTable("#tNotificacionesPM", 10, false, false, false);
}

//Notificaciones
function activiarTab(opc) {
  if (opc == 1) {
    $("#tRecibidos").removeAttr("style");
    $("#tPendientes").attr("style", "display: none;");
    $("#btnNotificacionRecibido")
      .removeClass()
      .addClass("btn btn-eliminar-udb");
    $("#btnNotificacionPendiente")
      .removeClass()
      .addClass("btn btn-outline-warning");
    notificaciones(1);
  } else {
    $("#tRecibidos").attr("style", "display: none;");
    $("#tPendientes").removeAttr("style");
    $("#btnNotificacionRecibido")
      .removeClass()
      .addClass("btn btn-outline-danger");
    $("#btnNotificacionPendiente").removeClass().addClass("btn btn-editar-udb");
    notificaciones(2);
  }
}

function modal() {
  notificaciones(1);
}

function notificaciones(opc) {
  var opc = opc;
  var url = "";
  var tbody = "";

  if (opc == 1) {
    url = urlNotificacionesNoVistas;
    tbody = $("#tBodyR");
    var grid1 = $("#tNotificacionesRM").DataTable();
    grid1.destroy();
  } else if (opc == 2) {
    url = urlNotificacionesNoEjecutadas;
    tbody = $("#tBodyP");
    var grid1 = $("#tNotificacionesPM").DataTable();
    grid1.destroy();
  }

  $.ajax({
    type: "POST",
    url: url,
    data: {},
    success: function (res) {
      var tr = "";
      tbody.empty();

      $(res.lista).each(function (key, value) {
        var url = value.URL.replace("~/", urlBase);

        var tr =
          tr +
          "<tr>" +
          "<td>" +
          value.FechaEnvio +
          "</td>" +
          "<td>" +
          value.IdDocumento +
          "</td>" +
          "<td>" +
          value.NombreTipoDocumento +
          "</td>" +
          "<td>" +
          value.mensaje +
          "</td>" +
          "<td>" +
          value.Titular +
          "</td>" +
          "<td>" +
          value.NombreEstado +
          "</td>" +
          "<td><a href=" +
          url +
          " class='btn btn-mostrar-udb btn-sm' data-toggle='tooltip' data-placement='bottom' title='Ver'><i class='fas fa-binoculars'></i></a></td>" +
          "</tr>";
        tbody.append(tr);
      });

      if (opc == 1) {
        dataTableNotificacionesRecibidas();
      } else if (opc == 2) {
        dataTableNotificacionesPendientes();
      }
    },
    error: function () {
      $("#modalNotificaciones").modal("hide");
      mostrarError("Ocurrió un error al mostrar la notificaciones.");
    },
  });
}

function setBadges(url) {
  $.ajax({
    type: "POST",
    url: url,
    data: {},
    success: function (res) {
      if (res.noVistas > 0) {
        $("#txtR").removeAttr("style");
        $("#txtR").text(res.noVistas);
      } else {
        $("#txtR").attr("style", "display: none;");
      }

      if (res.noEjecutadas > 0) {
        $("#txtP").removeAttr("style");
        $("#txtP").text(res.noEjecutadas);
      } else {
        $("#txtP").attr("style", "display: none;");
      }
    },
    error: function () {
      $("#txtR").attr("style", "display: none;");
      $("#txtP").attr("style", "display: none;");
    },
  });
}

//Mensajes de error
function mostrarError(msj) {
  $("#tipoMensaje").removeClass().addClass("alert alert-danger");
  $("#cabeceraMensaje").empty();
  $("#cabeceraMensaje").append('<i class="fas fa-times-circle"></i> Error');
  $("#textoMensaje").empty().append(msj);
  $("#modalMensaje").modal("show");
}

function mostrarAdvertencia(msj) {
  $("#tipoMensaje").removeClass().addClass("alert alert-warning");
  $("#cabeceraMensaje").empty();
  $("#cabeceraMensaje").append(
    '<i class="fas fa-exclamation-triangle"></i> Advertencia'
  );
  $("#textoMensaje").empty().append(msj);
  $("#modalMensaje").modal("show");
}

function mostrarExito(msj) {
  $("#tipoMensaje").removeClass().addClass("alert alert-success");
  $("#cabeceraMensaje").empty();
  $("#cabeceraMensaje").append('<i class="fas fa-check"></i> Mensaje');
  $("#textoMensaje").empty().append(msj);
  $("#modalMensaje").modal("show");
}

function mostrarMensaje(msj) {
  $("#tipoMensaje").removeClass().addClass("alert alert-info");
  $("#cabeceraMensaje").empty();
  $("#cabeceraMensaje").append('<i class="fas fa-info-circle"></i> Mensaje');
  $("#textoMensaje").empty().append(msj);
  $("#modalMensaje").modal("show");
}

function mostrarMensajeUTL(ObjMsj) {
  var MessageType = "alert m-auto ";
  var NameType = "";

  if (ObjMsj.TipoMensaje == 200101) {
    MessageType += "alert-danger";
    NameType = "<i class='fas fa-times-circle'></i> Error";
  } else if (ObjMsj.TipoMensaje == 200102) {
    MessageType += "alert-warning";
    NameType = "<i class='fas fa-exclamation-triangle'></i> Advertencia";
  } else if (ObjMsj.TipoMensaje == 200103) {
    MessageType += "alert-info";
    NameType = "<i class='fas fa-info-circle'></i> Información";
  } else if (ObjMsj.TipoMensaje == 200104) {
    MessageType += "alert-success";
    NameType = "<i class='fas fa-check'></i> Éxito";
  }

  $("#tipoMensajeUTL").removeClass().addClass(MessageType);
  $("#cabeceraMensajeUTL").empty();
  $("#cabeceraMensajeUTL").append(NameType);
  $("#textoMensajeUTL").empty().append(ObjMsj.Mensaje);
  $("#modalMensajeUTL").modal("show");
}

//Inicio de chosen
function inicializarChosen() {
  $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
    if (!$(this).next().hasClass("show")) {
      $(this)
        .parents(".dropdown-menu")
        .first()
        .find(".show")
        .removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass("show");

    $(this)
      .parents("li.nav-item.dropdown.show")
      .on("hidden.bs.dropdown", function (e) {
        $(".dropdown-submenu .show").removeClass("show");
      });

    return false;
  });
}

//Inicio datatable
function inicializarDataTable(
  control,
  tamañoPagina,
  busqueda,
  ordenamiento,
  cambiarLogitud,
  paging = true,
  info = true,
  rowsGroup = null,
  rowGroup = null,
  exportar = false
) {
  var options = {
    pageLength: tamañoPagina,
    language: {
      url: urlRepositorio + "js/lang/lang.json",
    },
    searching: busqueda,
    ordering: ordenamiento,
    lengthChange: cambiarLogitud,
    paging: paging,
    info: info,
    rowsGroup: rowsGroup,
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
  };

  if (rowGroup != null) {
    options["rowGroup"] = {
      dataSrc: rowGroup,
    };

    options["columnDefs"] = [
      {
        targets: rowGroup,
        visible: false,
      },
    ];

    var orden = [];

    for (var i = 0; i < rowGroup.length; i++) {
      var ord = [rowGroup[i], "asc"];
      orden.push(ord);
    }

    options["order"] = orden;
  }

  if (exportar == true) {
    options["buttons"] = [
      {
        extend: "excel",
        text: '<i class="fas fa-file-excel"></i> Exportar',
        className: "btn btn-aceptar-udb btn-lg d-none",
      },
    ];
    options["dom"] = "Bfrtip";
  }

  $(control).DataTable(options);
}

const inicializarDataTableN = (parametros) => {
  //Obtengo objeto de parametros y coloco valores por defecto
  if (parametros === undefined) parametros = {};
  if (parametros.control === undefined) parametros.control = "";
  if (parametros.tamañoPagina === undefined) parametros.tamañoPagina = 10;
  if (parametros.busqueda === undefined) parametros.busqueda = false;
  if (parametros.ordenamiento === undefined) parametros.ordenamiento = false;
  if (parametros.cambiarLogitud === undefined)
    parametros.cambiarLogitud = false;
  if (parametros.paging === undefined) parametros.paging = true;
  if (parametros.info === undefined) parametros.info = true;
  if (parametros.exportar === undefined) parametros.exportar = false;

  const options = {
    pageLength: parametros.tamañoPagina,
    language: {
      url: urlRepositorio + "js/lang/lang.json",
    },
    searching: parametros.busqueda,
    ordering: parametros.ordenamiento,
    lengthChange: parametros.cambiarLogitud,
    paging: parametros.paging,
    info: parametros.info,
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
  };

  if (parametros.rowsGroup != undefined) {
    options["rowsGroup"] = parametros.rowsGroup;
  }

  if (parametros.rowGroup != undefined) {
    options["rowGroup"] = {
      dataSrc: parametros.rowGroup,
    };

    options["columnDefs"] = [
      {
        targets: parametros.rowGroup,
        visible: false,
      },
    ];

    var orden = [];

    for (var i = 0; i < parametros.rowGroup.length; i++) {
      var ord = [parametros.rowGroup[i], "asc"];
      orden.push(ord);
    }

    options["order"] = orden;
  }

  if (parametros.exportar == true) {
    options["buttons"] = [
      {
        extend: "excel",
        text: '<i class="fas fa-file-excel"></i> Exportar',
        className: "btn btn-aceptar-udb btn-lg d-none",
      },
    ];
    options["dom"] = "Bfrtip";
  }

  $(parametros.control).DataTable(options);
};

//Clases CSS para dimensionar botones con iconos
function dimensionarBotones() {
  $("i.fas, i.fa, i.far, i.fal, i.fad, i.fab")
    .parents(".btn:not(.btn-sm,.btn-lg)")
    .addClass("btn-resize-udb");
  $("i.fas, i.fa, i.far, i.fal, i.fad, i.fab")
    .parents(".btn.btn-sm")
    .addClass("btn-sm-resize-udb");
  $("i.fas, i.fa, i.far, i.fal, i.fad, i.fab")
    .parents(".btn.btn-lg")
    .addClass("btn-lg-resize-udb");
}

//#region Controles de BS5
function inicializarControlesBS5() {
  if ($.fn.tooltip.Constructor.VERSION.split(".")[0] == "5") {
    inicializarTooltipBS5();
  }

  if ($.fn.popover.Constructor.VERSION.split(".")[0] == "5") {
    inicializarPopoverBS5();
  }
}

function inicializarTooltipBS5() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function inicializarPopoverBS5() {
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
}

//#endregion

//#region  ScrollUp
function cargarScrollUp() {
  if (FlagScrollUpUDB) {
    $("body").append($("<div>").load(urlRepositorio + "html/ScrollUp.html"));
  }
}

$(window).scroll(function () {
  if ($(this).scrollTop() > 100) {
    $("a.scroll-up").fadeIn("slow");
  } else {
    $("a.scroll-up").fadeOut("slow");
  }
});

function ScrollUpActivate() {
  $("html, body").animate({ scrollTop: 0 }, 600);
}
//#endregion

//#region FixedHeaderTable
function cargarFixedTableHeader(IdTabla, Top) {
  var style = document.createElement("style");
  style.innerHTML =
    "#" +
    IdTabla +
    " th { position: -webkit-sticky; position: sticky; top: " +
    Top +
    "px; z-index: 2; }";
  style.innerHTML +=
    "#" +
    IdTabla +
    " th[scope=row] { position: -webkit-sticky; position: sticky; left: 0; z-index: 1; }";
  document.body.appendChild(style);
}
////#endregion

/**
 * Funcion para eliminar el token de los sistemas con este tipo de autenticacion.
 */
const eliminarCookieToken = () =>
  (document.cookie = `${cookieAccesoName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`);

document
  .querySelectorAll('a[href$="/Login/Logout"]')
  .forEach((input) =>
    input.addEventListener("click", () => eliminarCookieToken())
  );
