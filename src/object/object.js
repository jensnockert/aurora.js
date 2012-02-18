void function () {
	Aurora.object = {
		create: function () {
			return Object.create(this, {
				name: { value: null, writable: true, enumerable: true },
				hidden: { value: { parent: null, listeners: {} } },
				parent: {
					get: function () {
						return this.hidden.parent
					}, set: function (parent) {
						var old = this.hidden.parent
						
						this.hidden.parent = parent
						
						if (parent) {
							this.dispatchEvent({ sender: this, type: 'parent-set', newParent: parent, oldParent: old })
						} else {
							this.dispatchEvent({ sender: this, type: 'parent-unset', oldParent: old })
						}
						
						return parent
					}, enumerable: true
				},
			})
		},
		
		addEventListener: function (type, listener) {
			var typeListeners = this.hidden.listeners[type]
				
			if (!typeListeners) {
				typeListeners = this.hidden.listeners[type] = {}
			}
				
			typeListeners[listener] = listener
				
			return this
		},
		
		removeEventListener: function (type, listener) {
			var typeListeners = this.hidden.listeners[type]
				
			if (typeListeners) {
				delete typeListeners[listener]
			}
				
			return this
		},
		
		dispatchEvent: function (event) {
			var type = event.type
			
			var typeListeners = this.hidden.listeners[type]
			
			for (var key in typeListeners) {
				typeListeners[key](event)
			}
			
			return this
		}
	}
	
	Object.seal(Aurora.object)
}()