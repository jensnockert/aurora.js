ObjectTest = AsyncTestCase("Object Test");

ObjectTest.prototype.testCreate = function () {
  var obj = Aurora.object.create()
  
  assertEquals(Aurora.object, Object.getPrototypeOf(obj))
  assertEquals({ name: null, parent: null, prototype: Aurora.object }, obj)
}

ObjectTest.prototype.testEvents = function () {
	var o = Aurora.object.create(), r = false
	
	var f = function () {
		r = true
	}
	
	o.addEventListener('test', f, true)
	assertEquals(false, r)
	
	o.dispatchEvent({ type: 'test' }, true)
	assertEquals(true, r)
	
	r = false
	o.removeEventListener('test', f)
	o.dispatchEvent({ type: 'test' }, true)
	assertEquals(false, r)
}

ObjectTest.prototype.testAsyncEvents = function (queue) {
	var o = Aurora.object.create(), r = false
	
	queue.call('Make sure that it does not accidentally trigger in current scope', function (callbacks) {
		o.addEventListener('test', callbacks.add(function () { r = true }))
		assertEquals(false, r)
		
		o.dispatchEvent({ type: 'test' })
		assertEquals(false, r)
	})
	
	queue.call('Make sure the event triggers once the interpreter is available', function (callbacks) {
		assertEquals(true, r)
	})
}

ObjectTest.prototype.testParent = function (queue) {
	var p = Aurora.object.create(), o = Aurora.object.create(), r = false
	
	queue.call('Make sure that it does not accidentally trigger in current scope', function (callbacks) {
		o.addEventListener('parent-set', callbacks.add(function () { r = true }))
		
		o.parent = p
		
		assertEquals(p, o.parent)
		assertEquals(false, r)
	})
	
	queue.call('Make sure parent-set triggers once the interpreter is available', function (callbacks) {
		assertEquals(true, r)
		
		var cb = callbacks.add(function () { r = false })
		o.addEventListener('parent-unset', cb)
		
		o.parent = null
		
		assertEquals(null, o.parent)
		assertEquals(true, r)
	})
	
	queue.call('Make sure parent-unset triggers once the interpreter is available', function (callbacks) {
		assertEquals(false, r)
	})
}
