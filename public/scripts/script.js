
$('i.bars').click(function(){
    $('.ui.sidebar')
         .sidebar('toggle')
});

$('#delete-button').click(function(){
    $('#delete-message').toggleClass('hidden');
});

$('#delete-cancel').click(function(){
    $('#delete-message').addClass('hidden');
});

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;
    
