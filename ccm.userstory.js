ccm.component( {
	name: 'userstory',
	
	config: {
		key: 'test',
		user: 'kremus',
		html:  [ ccm.store, { local: 'templates.json' } ],  
		store: [ ccm.store, { local: 'dataset.json' } ],       
		style: [ ccm.load, 'style.css' ]
	},
	Instance: function () {
		var self = this;  
		
		self.init = function ( callback ) {
			self.store.onChange = function () { self.render(); };
			callback();
		};
		
		self.render = function ( callback ) {
			var element = ccm.helper.element( self );
			self.store.get( self.key, function ( dataset ) {

				if ( dataset === null )
					self.store.set( { key: self.key, stories: [{
						"text": "My first story.",
						"prio": "Prio: 6",
						"user": "kremus"
					},
					{
						"text": "My second story.",
						"prio": "Prio: 5",
						"user": "kremus"
					}] }, proceed );
				else
					proceed( dataset );
				
				
				function proceed( dataset ) {
					element.html( ccm.helper.html( self.html.get( 'main' ) ) );
					var stories_div = ccm.helper.find( self, '.stories' );
					
					for ( var i = 0; i < dataset.stories.length; i++ ) {
						
						var storytext = dataset.stories[ i ];
						stories_div.append( ccm.helper.html( self.html.get( 'story' ), {
							user: ccm.helper.val( storytext.user ),
							prio: ccm.helper.val( storytext.prio ),
							text: ccm.helper.val( storytext.text )
						}));
					}

					stories_div.append( ccm.helper.html( self.html.get( 'input' ), { 
						onsubmit: function () {
							
							var storytext = ccm.helper.val( ccm.helper.find( self, 'textarea' ).val().trim() );
							var priotext = ccm.helper.val( ccm.helper.find( self, 'input' ).val().trim() );
							
							

							if ( storytext === '' ) return;
							if ( priotext === '' ) return;
							
							dataset.stories.push( { text: storytext, prio: 'Prio: ' + priotext, user: self.user  } ); 
							
							self.store.set( dataset, function () { self.render(); } );

							return false;
						}                                      
					}));
					if ( callback ) callback();
				}
			});
		}
	}
});