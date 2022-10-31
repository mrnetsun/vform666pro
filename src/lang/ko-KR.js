export default {
  application: {
    'ko-KR': '한국어',
	'zh-CN': '简体中文',
    'en-US': 'English',
    productTitle: '업무양식 디자이너',
    github: 'GitHub',
    document: '문서',
    qqGroup: 'WeChat Group',
    deployment: '배포',
    subscription: '구독',
  },

  designer: {
    componentLib: '구성 요소',
    formLib: '템플릿',
    containerTitle: '컨테이너',
    dragHandlerHint: '컨테이너 또는 필드를 레이아웃 센터로 드래그',
    dragAction: '드래그',
    basicFieldTitle: '기본 필드',
    advancedFieldTitle: '고급 필드',
    customFieldTitle: '사용자 정의 필드',

    noWidgetHint: '왼쪽 목록에서 위젯을 선택하고 이 컨테이너에 끌어다 놓으십시오.',

    widgetLabel: {
      grid:             '그리드',
      table:            '테이블',
      tab:              '탭',
      section:          '섹션',
      'sub-form':       '서브폼',
      'grid-sub-form':  '그리드서브폼',
      'grid-col':       '그리드컬럼',
      'table-cell':     '테이블셀',
      'tab-pane':       '탭항목',
      'data-table':     '데이터 테이블',
      'vf-dialog':      '대화상자',
      'vf-drawer':      '드로워',

      input:          '입력요소',
      textarea:       '텍스트영역',
      number:         '숫자입력',
      radio:          '라디오',
      checkbox:       '체크박스',
      select:         '셀렉트',
      time:           '시간',
      'time-range':   '시간범위',
      date:           '날짜',
      'date-range':   '날짜 범위',
      switch:         '스위치',
      rate:           '비율',
      color:          '색상선택',
      slider:         '슬라이더',
      'static-text':  '텍스트',
      'html-text':    'HTML',
      button:         '버튼',
      divider:        '구분선',

      'picture-upload': '이미지 업로드',
      'file-upload':    '파일 업로드',
      'rich-editor':    '텍스트 에디터',
      cascader:         '케스케이더',
      slot:             '슬롯',

      custom:           '커스텀 컴포넌트',
    },

    hint: {
      selectParentWidget: '이 위젯의 상위 항목 선택',
      moveUpWidget: '이 위젯 위로 이동',
      moveDownWidget: '이 위젯 아래로 이동',
      cloneWidget: '이 위젯 복제',
      insertRow: '새 행 삽입',
      insertColumn: '새 열 삽입',
      remove: '이 위젯 제거',
      cellSetting: '셀 설정',
      dragHandler: '드래그 핸들러',
      copyField: '필드 위젯 복사',
      onlyFieldWidgetAcceptable: '필드 위젯만 하위 양식으로 드래그할 수 있습니다',
      moveUpFirstChildHint: '첫번째 자식 위젯은 위로 이동할 수 없습니다',
      moveDownLastChildHint: '마지막 자식 위젯은 아래로 이동할 수 없습니다',

      closePreview: '닫기',
      copyJson: '복사',
      saveFormJson: '파일로 저장',
      copyVueCode: '뷰 코드 복사',
      copyHtmlCode: 'HTML 코드 복사',
      copyJsonSuccess: '복사 성공',
      importJsonSuccess: '가져오기 성공',
      invalidJsonFormat: '잘못된 JSON 형식',
      jsonVersionMismatch: 'JSON 불일치 버전',
      copyJsonFail: '복사 실패',
      copyVueCodeSuccess: '복사 성공',
      copyVueCodeFail: '복사 실패',
      copyHtmlCodeSuccess: '복사 성공',
      copyHtmlCodeFail: '복사 실패',
      saveVueCode: 'Vue 파일 저장',
      saveHtmlCode: 'HTML 파일 저장',
      getFormData: '데이터 가져오기',
      resetForm: '재설정',
      disableForm: '비활성화',
      enableForm: '활성화',
      switchReadMode: '읽기 모드',
      exportFormData: '양식 데이터',
      copyFormData: '복사',
      saveFormData: '파일로 저장',
      copyVue2SFC: 'Vue2 복사',
      copyVue3SFC: 'Vue3 복사',
      copySFCFail: '복사 실패',
      copySFCSuccess: '복사 성공',
      saveVue2SFC: 'Vue2로 저장',
      saveVue3SFC: 'Vue3으로 저장',
      fileNameForSave: '파일 이름:',
      saveFileTitle: '파일로 저장',
      fileNameInputPlaceholder: '파일 이름을 입력하세요',
      sampleLoadedSuccess: '예제 로드 성공',
      sampleLoadedFail: '샘플 로드 실패',
      loadFormTemplate: '이 항목 로드',
      loadFormTemplateHint: '이 템플릿을 로드하시겠습니까?',
      loadFormTemplateSuccess: '양식 템플릿 로드 성공!',
      loadFormTemplateFailed: '양식 템플릿을 로드하지 못했습니다.',
      currentNodeCannotBeSelected: '현재 노드를 선택할 수 없습니다.',
      noSelectedWidgetHint: '선택한 위젯이 없습니다.',

      widgetSetting: '위젯 설정',
      formSetting: '양식 설정',

      prompt: '프롬프트',
      confirm: '확인',
      cancel: '취소',
      import: '가져오기',
      importJsonHint: '가져올 코드는 다음 JSON 형식이어야 합니다.',
      importDSHint: '가져온 데이터 소스의 형식이 유효해야 합니다.',
      invalidOptionsData: '잘못된 옵션 데이터:',
      lastPaneCannotBeDeleted: '마지막 항목은 삭제할 수 없습니다.',
      duplicateName: '중복 이름: ',
      nameRequired: '이름이 필요합니다.',

      numberValidator: '숫자',
      letterValidator: '글자',
      letterAndNumberValidator: '글자및숫자',
      mobilePhoneValidator: '모바일폰',
      emailValidator: '이메일',
      urlValidator: 'URL',
      noChineseValidator: '비중국어',
      chineseValidator: '중국어',

      rowspanNotConsistentForMergeEntireRow: '이 행의 셀에는 동일한 rowspan이 없습니다. 작업이 실패했습니다.',
      colspanNotConsistentForMergeEntireColumn: '이 열의 셀에는 동일한 colspan이 없습니다. 작업이 실패했습니다.',
      rowspanNotConsistentForDeleteEntireRow: '이 행의 셀에는 동일한 rowspan이 없습니다. 작업이 실패했습니다.',
      colspanNotConsistentForDeleteEntireColumn: '이 열의 셀에는 동일한 colspan이 없습니다. 작업이 실패했습니다.',
      lastColCannotBeDeleted: '마지막 열을 삭제할 수 없습니다.',
      lastRowCannotBeDeleted: '마지막 행은 삭제할 수 없습니다.',
    },

    toolbar: {
      undoHint: '실행 취소',
      redoHint: '다시 실행',
      pcLayout: 'PC',
      padLayout: '패드',
      mobileLayout: 'H5',
      nodeTreeHint: '구성 요소 계층 구조의 트리 보기',
      nodeTreeTitle: '구성 요소 계층 구조의 트리 보기',
      clear: '지우기',
      preview: '미리보기',
      importJson: '가져오기',
      exportJson: '내보내기',
      exportCode: '코드',
      generateCode: '코드 생성',
      generateSFC: 'SFC 생성',
    },

    setting: {
      basicSetting: '기본 설정',
      attributeSetting: '속성 설정',
      commonSetting: '공통 설정',
      advancedSetting: '고급 설정',
      eventSetting: '이벤트 설정',
      uniqueName: '고유한 이름',
      editNameHelp: '수정을 확인하려면 Enter 키를 누르십시오.',
      label: '레이블',
      displayType: '유형',
      defaultValue: '기본값',
      placeholder: '자리 표시자',
      startPlaceholder: '시작 자리 표시자',
      endPlaceholder: '끝 자리 표시자',
      widgetColumnWidth: '너비',
      widgetSize: '크기',
      autoFullWidth: '자동 전체 너비',
      showStops: '정지 표시',
      displayStyle: '디스플레이 스타일',
      inlineLayout: '인라인',
      blockLayout: '블록',
      buttonStyle: '버튼으로 표시',
      border: '테두리 표시',
      labelWidth: '레이블 너비',
      rows: '행',
      labelHidden: '레이블 숨기기',
      required: '필수',
      requiredHint: '실패 힌트',
      validation: '검증',
      validationHelp: '정규 표현식 지원',
      validationHint: '검증 힌트',
      readonly: '읽기 전용',
      disabled: '비활성화됨',
      hidden: '숨김',
      textContent: '텍스트',
      htmlContent: 'HTML',
      clearable: '지울 수 있는',
      editable: '편집 가능',
      format: '형식',
      valueFormat: '값 형식',
      showPassword: '공개 표시',
      filterable: '필터링 가능',
      allowCreate: '만들기 허용',
      remote: '원격',
      automaticDropdown: '자동 드롭다운',
      multiple: '다중',
      multipleLimit: '다중 제한',
      checkStrictly: '모든 레벨 선택 가능',
      showAllLevels: '모든 레벨 표시',
      contentPosition: '콘텐츠 위치',
      dividerDirection: '방향',
      plain: '일반',
      round: '라운드',
      circle: '원',
      icon: '아이콘',
      optionsSetting: '옵션 설정',
      addOption: '옵션 추가',
      importOptions: '가져오기 옵션',
      resetDefault: '기본값 재설정',
      uploadSetting: '업로드 설정',
      uploadURL: '업로드 URL',
      uploadTip: '팁 콘텐츠',
      withCredentials: '쿠키 보내기',
      multipleSelect: '파일 다중 선택',
      showFileList: '파일 목록 표시',
      limit: '최대 업로드 수',
      fileMaxSize: '최대 크기(MB)',
      fileTypes: '파일 형식 업로드',
      fileTypesHelp: '더 많은 파일 형식을 추가할 수 있습니다.',
      headers: '요청 헤더',

      cellWidth: '너비',
      cellHeight: '높이',
      gridColHeight: '열의 높이(px)',
      gutter: '거터(px)',
      columnSetting: '열 설정',
      colsOfGrid: '그리드의 열:',
      colSpanTitle: 'Spans Of Col',
      colOffsetTitle: '열 오프셋',
      colPushTitle: 'Push Of Col',
      colPullTitle: 'Pull Of Col',
      addColumn: '열 추가',
      responsive: '반응형',

      tabPaneSetting: '탭항목',
      addTabPane: '탭항목 추가',
      paneActive: '활성',

      customLabelIcon: '사용자 정의 레이블',
      labelIconClass: '레이블 아이콘 클래스',
      labelIconPosition: '레이블 아이콘 위치',
      labelTooltip: '레이블 툴팁',
      minValue: '최소값',
      maxValue: '최대값',
      precision: '정밀도',
      step: '단계',
      controlsPosition: '콘트롤 위치',
      minLength: '최소 길이',
      maxLength: '최대 길이',
      showWordLimit: '단어 제한 표시',
      prefixIcon: '접두사 아이콘',
      suffixIcon: '접미사 아이콘',
      inputButton: '입력 버튼 설정',
      appendButton: '추가 버튼',
      appendButtonDisabled: '버튼 비활성화',
      appendButtonIcon: '버튼 아이콘 추가',
      buttonIcon: '버튼 아이콘',
      switchWidth: '스위치의 너비(px)',
      activeText: '활성 텍스트',
      inactiveText: '비활성 텍스트',
      activeColor: '활성 색상',
      inactiveColor: '비활성 색상',
      maxStars: '별 최대 수',
      lowThreshold: '낮은 임계값',
      highThreshold: '높은 임계값',
      allowHalf: '절반 허용',
      showText: '텍스트 표시',
      showScore: '점수 표시',
      range: '범위',
      vertical: '세로',
      showBlankRow: '빈 행 표시',
      showRowNumber: '행 번호 표시',
      actionColumnPosition: '버튼 열의 위치',
      contentHeight: '콘텐츠 영역 높이',

      insertColumnToLeft: '왼쪽에 열 삽입',
      insertColumnToRight: '오른쪽에 열 삽입',
      insertRowAbove: '위에 행 삽입',
      insertRowBelow: '아래에 행 삽입',
      mergeLeftColumn: '왼쪽 셀 병합',
      mergeRightColumn: '오른쪽 셀 병합',
      mergeEntireRow: '전체 행 병합',
      mergeRowAbove: '위의 셀 병합',
      mergeRowBelow: '아래 셀 병합',
      mergeEntireColumn: '전체 열 병합',
      undoMergeCol: '병합 열 실행 취소',
      undoMergeRow: '병합 행 실행 취소',
      deleteEntireCol: '전체 열 삭제',
      deleteEntireRow: '전체 행 삭제',

      widgetName: '고유 이름',
      formSize: '크기',
      labelPosition: '레이블의 위치',
      topPosition: '상단',
      leftPosition: '왼쪽',
      labelAlign: '레이블 정렬',
      leftAlign: '왼쪽',
      centerAlign: '중앙',
      rightAlign: '오른쪽',
      formCss: '양식 CSS',
      addCss: '편집',
      customClass: '사용자 정의 클래스',
      globalFunctions: '전역 함수',
      addEventHandler: '편집',
      editWidgetEventHandler: '위젯 이벤트 핸들러 편집',
      editFormEventHandler: '양식 이벤트 처리기 편집',
      formSFCSetting: 'SFC 설정',
      formModelName: '모델 이름',
      formRefName: '참조 이름',
      formRulesName: '규칙 이름',
      syntaxCheckWarning: '자바스크립트 코드에 구문 오류가 있습니다. 다시 확인하십시오!',

      //dialog & drawer
      title: '제목',
      dialogWidth: '너비(px/%)',
      fullscreen: '전체 화면',
      showModal: '모달 표시',
      showClose: '닫기 표시',
      closeOnClickModal: '닫기 위해 모달 클릭',
      closeOnPressEscape: '닫으려면 Esc 키를 누르세요',
      center: '가운데 머리글 및 바닥글',
      readMode: '양식 읽기 전용',
      disabledMode: '양식 비활성화됨',
      okButtonLabel: 'OK Btn의 레이블',
      okButtonHidden: 'OK Btn 숨기기',
      cancelButtonLabel: '취소 Btn의 레이블',
      cancelButtonHidden: '취소 취소 버튼 숨기기',
      drawSize: '크기(픽셀/%)',
      drawDirection: '방향',

      //data-table
      tableWidth: '너비(픽셀/%)',
      tableHeight: '높이(px/%)',
      showCheckBox: '체크박스 표시',
      showIndex: '행 번호 표시',
      showPagination: '페이지 매김 표시',
      smallPagination: '작은 페이지 매김',
      tableColEdit: '열 편집',
      tableDataEdit: '데이터 편집',
      stripe: '스트라이프',
      showSummary: '요약 표시',
      rowSpacing: '행 간격(px)',
      editAction: '편집...',
      columnName: '이름',
      columnLabel: '레이블',
      columnWidth: '너비(픽셀/%)',
      visibleColumn: '표시',
      sortableColumn: '정렬 가능',
      fixedColumn: '고정',
      alignTypeOfColumn: '정렬',
      formatOfColumn: '형식',
      customRenderGroup: '사용자 지정 렌더링',
      renderFunction: '렌더링',
      actionColumn: '액션',
      addTableColumn: '새 열 추가',
      deleteTableColumn: '이 열 삭제',
      onlyOneColumnCannotBeDeleted: '마지막 열은 삭제할 수 없습니다.',
      showButtonsColumn: '버튼 열',
      buttonColumnEdit: '버튼 편집',
      buttonColumnTitle: '제목',
      buttonColumnWidth: '너비(픽셀)',
      operationButtonsSetting: '버튼 설정',
      operationButtonName: '이름',
      operationButtonLabel: '텍스트',
      operationButtonType: '유형',
      operationButtonSize: '크기',
      operationButtonRound: '라운드',
      operationButtonHidden: '숨김',
      operationButtonDisabled: '사용 안 함',
      addOperationButton: '새 버튼 추가',
      deleteOperationButtonHint: '이 버튼을 삭제하시겠습니까?',
      operationButtonDuplicatedNameError: '중복된 버튼 이름입니다.',

      //data-source
      dsEnabled: '데이터 소스 사용',
      dsName: '데이터 소스 이름',
      dataSetName: '데이터 세트 이름',
      labelKeyName: '레이블 키',
      valueKeyName: '값 키',
      childrenKeyName: '자식 키',
      dataSource: '데이터 소스',
      noDataSource: '데이터 소스가 없습니다.',
      addDataSource: '데이터 소스 추가',
      importDataSource: '데이터 소스 가져오기',
      clearExistingDataSource: '기존 데이터 소스 비우기',
      restExistingDataSource: '기존 데이터 소스에 추가',
      exportDataSource: '데이터 소스 내보내기',
      selectDataSourceForExport: '데이터 소스 선택',
      dataSourceChecked: '확인',
      previewDataSourceExportResult: '미리보기 결과',
      dataSourceSetting: '데이터 소스 설정',
      deleteDataSourceHint: '이 데이터 소스를 삭제하시겠습니까?',
      fieldValueRequired: '값은 null일 수 없습니다',
      dsUniqueName: '고유한 이름',
      dsRequestURL: '요청 URL',
      dsRequestURLType: '요청 URL 유형',
      dsURLStringType: '문자열',
      dsURLVariableType: '표현식',
      dsDescription: '설명',
      dsRequestMethod: '요청 방법',
      dsRequestHeaders: '헤더',
      addRequestHeader: '헤더 추가',
      dsRequestParams: '매개변수',
      addRequestParam: '매개변수 추가',
      dsRequestData: '데이터',
      addRequestData: '데이터 추가',
      addDataSet: '데이터 세트 추가',
      dsRequestValueStringType: '문자열',
      dsRequestValueNumberType: '숫자',
      dsRequestValueBooleanType: '부울',
      dsRequestValueVariableType: '변수',
      dsRequestNameInputPlaceholder: '이름',
      dsRequestTypeInputPlaceholder: '유형',
      dsRequestValueInputPlaceholder: '값',
      dataSetRemarkInputPlaceholder: '참고',
      dsConfigHandlerTitle: '1. 구성 처리기',
      dsDataHandlerTitle: '2. 데이터 핸들러',
      dsErrorHandlerTitle: '3. 오류 처리기',
      dataSetSettingTitle: '4. 데이터 세트 설정',
      dataSetEnabled: '여러 데이터 세트 사용',
      dataSetSetting: '데이터 집합 목록',
      testDataSource: '테스트 데이터 소스',
      dsvTitle: '데이터 소스 변수',
      dsRequestResult: '결과 데이터',
      executeDataSource: '테스트 실행',
      clearRequestResult: '결과 지우기',
      dsRequestNumberTypeError: '숫자 값 오류',
      dsRequestBooleanTypeError: '부울 값 오류',
      dsValidationError: '데이터 소스 검사 실패.',
      dsDuplicatedNameError: '데이터 소스 이름이 중복되었습니다.',
    }

  }
}