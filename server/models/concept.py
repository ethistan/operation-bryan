from mongokit.document import Document

class Concept(Document):
	__collection__ = 'form'
	structure = {
		'name': basestring,
		'overview': basestring,
		'parents': [],
		'children': [],
		'related': [],
		'fields': [
			{"name": basestring,
			 "value": basestring}
		],
	}

	use_dot_notation = True
