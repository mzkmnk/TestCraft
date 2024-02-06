@api.get("/create_user_workbook")
def get_create_user_workbook(request):
    try:
        workbooks = Workbook.objects.filter(create_id__id = request.user.id).order_by('-created_at').values(
            'id',
            'workbook_name',
            'description',
            'create_id__username',
            'created_at',
            'updated_at',
            'like_count',   
        )
        workbooks_with_categories = []
        for workbook in workbooks:
            categories = WorkbookCategory.objects.filter(id=workbook['id']).values_list('category__category_name', flat=True)
            workbooks_with_categories.append({
                **workbook,
                'categories': list(categories)
            })
        print(workbooks_with_categories)
        return JsonResponse(
            {
                'success' : True,
                'workbook' : workbooks_with_categories,
            },
            status = 200
        )
    except Exception as e:
        return JsonResponse(
            {
                'success' : False,
                'workbook' : None
            },
            status = 400
            )