(function($){
	const tab = $('.tab');

	tab.find(".tab-nav-a").on('click', function(e){
		e.preventDefault();
		const root = $(this).parent().parent();
		const parent = $(this).parent();

		const tabContentId = $(this).data('for');
		root.find(".tab-content").removeClass('tab-active');
		root.find('#'+tabContentId).addClass('tab-active');
		
		parent.find('.tab-nav-a').removeClass('tab-active');
		$(this).addClass('tab-active');
	})

}(jQuery));