<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
	xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
	xmlns:ccts="urn:un:unece:uncefact:documentation:2"
	xmlns:clm54217="urn:un:unece:uncefact:codelist:specification:54217:2001"
	xmlns:clm5639="urn:un:unece:uncefact:codelist:specification:5639:1988"
	xmlns:clm66411="urn:un:unece:uncefact:codelist:specification:66411:2001"
	xmlns:clmIANAMIMEMediaType="urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003"
	xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:link="http://www.xbrl.org/2003/linkbase"
	xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
	xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2"
	xmlns:udt="urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2"
	xmlns:xbrldi="http://xbrl.org/2006/xbrldi" xmlns:xbrli="http://www.xbrl.org/2003/instance"
	xmlns:xdt="http://www.w3.org/2005/xpath-datatypes" xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	exclude-result-prefixes="cac cbc ccts clm54217 clm5639 clm66411 clmIANAMIMEMediaType fn link n1 qdt udt xbrldi xbrli xdt xlink xs xsd xsi">
	<xsl:decimal-format name="european" decimal-separator="," grouping-separator="." NaN=""/>
	<xsl:output version="4.0" method="html" indent="no" encoding="UTF-8"
		doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN"
		doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>
	<xsl:param name="SV_OutputFormat" select="'HTML'"/>
	<xsl:variable name="XML" select="/"/>
	<xsl:template match="/">
		<html>
			<head>
				<title/>
				<style type="text/css">
					body {
					    background-color: #FFFFFF;
					    font-family: 'Tahoma', "Times New Roman", Times, serif;
					    font-size: 11px;
					    color: #666666;
					}
					h1, h2 {
					    padding-bottom: 3px;
					    padding-top: 3px;
					    margin-bottom: 5px;
					    text-transform: uppercase;
					    font-family: Arial, Helvetica, sans-serif;
					}
					h1 {
					    font-size: 1.4em;
					    text-transform:none;
					}
					h2 {
					    font-size: 1em;
					    color: brown;
					}
					h3 {
					    font-size: 1em;
					    color: #333333;
					    text-align: justify;
					    margin: 0;
					    padding: 0;
					}
					h4 {
					    font-size: 1.1em;
					    font-style: bold;
					    font-family: Arial, Helvetica, sans-serif;
					    color: #000000;
					    margin: 0;
					    padding: 0;
					}
					hr {
              border: none;
					    height:1px;
					    color: #000080;
					    background-color: #000080;
					    border-bottom: 1px solid 	#000080;
					}
					p, ul, ol {
					    margin-top: 1.5em;
					}
					ul, ol {
					    margin-left: 3em;
					}
					blockquote {
					    margin-left: 3em;
					    margin-right: 3em;
					    font-style: italic;
					}
					a {
					    text-decoration: none;
					    color: #70A300;
					}
					a:hover {
					    border: none;
					    color: #70A300;
					}
					#despatchTable {
					    border-collapse:collapse;
					    font-size:11px;
					    float:right;
					    border-color:#000080;
					}
					#ettnTable {
					    border-collapse:collapse;
					    font-size:11px;
					    border-color:gray;
					}
					#customerPartyTable {
					    border-width: 0px;
					    border-spacing:;
					    border-style: inset;
					    border-color: gray;
					    border-collapse: collapse;
					    background-color:
					}
					#customerIDTable {
					    border-width: 2px;
					    border-spacing:;
					    border-style: inset;
					    border-color: gray;
					    border-collapse: collapse;
					    background-color:
					}
					#customerIDTableTd {
					    border-width: 2px;
					    border-spacing:;
					    border-style: inset;
					    border-color: gray;
					    border-collapse: collapse;
					    background-color:
					}
					#lineTable {
					    border-width:1px;
					    border-spacing:;
					    border-style: inset;
					    border-color: #000080;
					    border-collapse: collapse;
					    background-color:;
					}
					#lineTableTd {
					    border-width: 1px;
					    padding: 1px;
					    border-style: inset;
					    border-color: #000080;
					    background-color: white;
					}
					#lineTableTr {
					    border-width: 1px;
					    padding: 0px;
					    border-style: inset;
					    border-color: #000080;
					    background-color: white;
					    -moz-border-radius:;
					}
					#lineTableDummyTd {
					    border-width: 1px;
					    border-color:white;
					    padding: 1px;
					    border-style: inset;
					    border-color: #000080;
					    background-color: white;
					}
					#lineTableBudgetTd {
					    border-width: 1px;
					    border-spacing:0px;
					    padding: 1px;
					    border-style: inset;
					    border-color: #000080;
					    background-color: white;
					    -moz-border-radius:;
					}
					#notesTable {
					    border-width: 1px;
					    border-spacing:;
					    border-style: inset;
					    border-color: 	#000080;
					    border-collapse: collapse;
					    background-color: 
					}
					#notesTableTd {
					    border-width: 0px;
					    border-spacing:;
					    border-style: inset;
					    border-color: 	#000080;
					    border-collapse: collapse;
					    background-color:
					}
					table {
					    border-spacing:0px;
					}
					#budgetContainerTable {
					    border-width: 0px;
					    border-spacing: 0px;
					    border-style: inset;
					    border-color: #000080;
					    border-collapse: collapse;
					    background-color:;
					}
					td {
					    border-color:#000080;
					}</style>
				<title>e-ArÅiv</title>
			</head>
			<body
				style="margin-left=0.6in; margin-right=0.6in; margin-top=0.79in; margin-bottom=0.79in">
				<xsl:for-each select="$XML">
					<table style="border-color:blue; " border="0" cellspacing="0px" width="800"
						cellpadding="0px">
						<tbody>
							<tr valign="top">
								<td width="40%">
									<br/>
									<table align="center" border="0" width="100%">
										<tbody>
											<hr/>
											<tr align="left">
												<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cac:AccountingSupplierParty">
												<xsl:for-each select="cac:Party">
												<td align="left">
												<xsl:if test="cac:PartyName">
												<xsl:value-of select="cac:PartyName/cbc:Name"/>
												<br/>
												</xsl:if>
												<xsl:for-each select="cac:Person">
												<xsl:for-each select="cbc:Title">
												<xsl:apply-templates/>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												<xsl:for-each select="cbc:FirstName">
												<xsl:apply-templates/>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												<xsl:for-each select="cbc:MiddleName">
												<xsl:apply-templates/>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												<xsl:for-each select="cbc:FamilyName">
												<xsl:apply-templates/>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												<xsl:for-each select="cbc:NameSuffix">
												<xsl:apply-templates/>
												</xsl:for-each>
												</xsl:for-each>
												</td>
												</xsl:for-each>
												</xsl:for-each>
												</xsl:for-each>
											</tr>
											<tr align="left">
												<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cac:AccountingSupplierParty">
												<xsl:for-each select="cac:Party">
												<td align="left">
												<xsl:for-each select="cac:PostalAddress">
												<xsl:for-each select="cbc:StreetName">
												<xsl:apply-templates/>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												<xsl:for-each select="cbc:BuildingName">
												<xsl:apply-templates/>
												</xsl:for-each>
												<xsl:if test="cbc:BuildingNumber">
												<span>
												<xsl:text> No:</xsl:text>
												</span>
												<xsl:for-each select="cbc:BuildingNumber">
												<xsl:apply-templates/>
												</xsl:for-each>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:if>
												<br/>
												<xsl:for-each select="cbc:PostalZone">
												<xsl:apply-templates/>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												<xsl:for-each select="cbc:CitySubdivisionName">
												<xsl:apply-templates/>
												</xsl:for-each>
												<span>
												<xsl:text>/ </xsl:text>
												</span>
												<xsl:for-each select="cbc:CityName">
												<xsl:apply-templates/>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												</xsl:for-each>
												</td>
												</xsl:for-each>
												</xsl:for-each>
												</xsl:for-each>
											</tr>
											<xsl:if
												test="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:Telephone or //n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:Telefax">
												<tr align="left">
												<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cac:AccountingSupplierParty">
												<xsl:for-each select="cac:Party">
												<td align="left">
												<xsl:for-each select="cac:Contact">
												<xsl:if test="cbc:Telephone">
												<span>
												<xsl:text>Tel: </xsl:text>
												</span>
												<xsl:for-each select="cbc:Telephone">
												<xsl:apply-templates/>
												</xsl:for-each>
												</xsl:if>
												<xsl:if test="cbc:Telefax">
												<span>
												<xsl:text> Fax: </xsl:text>
												</span>
												<xsl:for-each select="cbc:Telefax">
												<xsl:apply-templates/>
												</xsl:for-each>
												</xsl:if>
												<span>
												<xsl:text>&#160;</xsl:text>
												</span>
												</xsl:for-each>
												</td>
												</xsl:for-each>
												</xsl:for-each>
												</xsl:for-each>
												</tr>
											</xsl:if>
											<xsl:for-each
												select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cbc:WebsiteURI">
												<tr align="left">
												<td>
												<xsl:text>Web Sitesi: </xsl:text>
												<xsl:value-of select="."/>
												</td>
												</tr>
											</xsl:for-each>
											<xsl:for-each
												select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:ElectronicMail">
												<tr align="left">
												<td>
												<xsl:text>E-Posta: </xsl:text>
												<xsl:value-of select="."/>
												</td>
												</tr>
											</xsl:for-each>
											<tr align="left">
												<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cac:AccountingSupplierParty">
												<xsl:for-each select="cac:Party">
												<td align="left">
												<span>
												<xsl:text>Vergi Dairesi: </xsl:text>
												</span>
												<xsl:for-each select="cac:PartyTaxScheme">
												<xsl:for-each select="cac:TaxScheme">
												<xsl:for-each select="cbc:Name">
												<xsl:apply-templates/>
												</xsl:for-each>
												</xsl:for-each>
												<span>
												<xsl:text>&#160; </xsl:text>
												</span>
												</xsl:for-each>
												</td>
												</xsl:for-each>
												</xsl:for-each>
												</xsl:for-each>
											</tr>
											<xsl:for-each
												select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification">
												<tr align="left">
												<td>
												<xsl:value-of select="cbc:ID/@schemeID"/>
												<xsl:text>: </xsl:text>
												<xsl:value-of select="cbc:ID"/>
												</td>
												</tr>
											</xsl:for-each>
                      <!--<tr align="left">
                        <td>
					  						<span>
                                      <xsl:text>TICARETSICILNO: 701439 </xsl:text>
                                    <br/>
									</span>
									
              <span>
                <xsl:text>MERSISNO: 0781044632000016</xsl:text>
              </span>
									</td>
                      </tr>-->
                    
										</tbody>
									</table>
									<!--<hr/>-->
								</td>
								<td width="20%" align="center" valign="middle">
									<br/>
									<br/>
									<img style="width:91px;" align="middle" alt="E-Fatura Logo"
										src="data:image/jpeg;base64,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"/>

									<h1 align="center">
										<span style="font-weight:bold; ">
											<xsl:text>e-ArÅiv FATURA</xsl:text>
										</span>
									</h1>
								</td>

                <td width="40%" align="right" valign="top">
                  <br/>
                  <br/>
                  <img style="width:191px;" align="right" alt="Spirax Sarco Logo"
										src="data:image/jpeg;base64,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"/>
                  <img style="width:191px;" align="right" alt="ISO Logo"
										src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RBuRXhpZgAATU0AKgAAAAgAAwExAAIAAAAHAAAIPodpAAQAAAABAAAIRuocAAcAAAgMAAAAMgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBpY2FzYQAAAAHqHAAHAAAIDAAACFgAAAAAHOoAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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ZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOkNyZWF0b3JUb29sPlBpY2FzYTwveG1wOkNyZWF0b3JUb29sPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMAAgEBAgEBAgICAgICAgIDBQMDAwMDBgQEAwUHBgcHBwYHBwgJCwkICAoIBwcKDQoKCwwMDAwHCQ4PDQwOCwwMDP/bAEMBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAIgBNwMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdI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"/>
                  

                </td>
                
								
							</tr>
							<tr style="height:118px; " valign="top">
								<td width="40%" align="right" valign="bottom">
									<table id="customerPartyTable" align="left" border="0"
										height="50%">
										<tbody>
											<tr style="height:71px; ">
												<td>
												<!--<hr/>-->
												<table align="center" border="0">
												<tbody>

                          <tr style="height:71px; ">
                            <td>
                              <hr/>
                              <table align="center" border="0">
                                <tbody>
                                  <tr>
                                    <xsl:for-each select="n1:Invoice">
                                      <xsl:for-each select="cac:AccountingCustomerParty">
                                        <xsl:for-each select="cac:Party">
                                          <td style="width:469px; " align="left">

                                          </td>
                                        </xsl:for-each>
                                      </xsl:for-each>
                                    </xsl:for-each>
                                  </tr>
                                  <tr>
                                    <xsl:for-each select="n1:Invoice">
                                      <xsl:for-each select="cac:AccountingCustomerParty">
                                        <xsl:for-each select="cac:Party">
                                          <td style="width:469px; " align="left">
                                            <xsl:if test="cac:PartyName">
                                              <xsl:value-of select="cac:PartyName/cbc:Name"/>

                                              <br/>
                                            </xsl:if>
                                            <xsl:for-each select="cac:Person">
                                              <xsl:for-each select="cbc:Title">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:FirstName">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:MiddleName">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160; </xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:FamilyName">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:NameSuffix">
                                                <xsl:apply-templates/>
                                              </xsl:for-each>
                                            </xsl:for-each>
                                          </td>
                                        </xsl:for-each>
                                      </xsl:for-each>
                                    </xsl:for-each>
                                  </tr>
                                  <tr>
                                    <xsl:for-each select="n1:Invoice">
                                      <xsl:for-each select="cac:AccountingCustomerParty">
                                        <xsl:for-each select="cac:Party">
                                          <td style="width:469px; " align="left">
                                            <xsl:for-each select="cac:PostalAddress">
                                              <xsl:for-each select="cbc:StreetName">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:BuildingName">
                                                <xsl:apply-templates/>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:BuildingNumber">
                                                <span>
                                                  <xsl:text> No:</xsl:text>
                                                </span>
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <br/>
                                              <xsl:for-each select="cbc:PostalZone">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:CitySubdivisionName">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>/ </xsl:text>
                                                </span>
                                              </xsl:for-each>
                                              <xsl:for-each select="cbc:CityName">
                                                <xsl:apply-templates/>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </xsl:for-each>
                                            </xsl:for-each>
                                          </td>
                                        </xsl:for-each>
                                      </xsl:for-each>
                                    </xsl:for-each>
                                  </tr>
                                  <xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cbc:WebsiteURI">
                                    <tr align="left">
                                      <td>
                                        <xsl:text>Web Sitesi: </xsl:text>
                                        <xsl:value-of select="."/>
                                      </td>
                                    </tr>
                                  </xsl:for-each>

                                  <xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:Contact/cbc:ElectronicMail">
                                    <tr align="left">
                                      <td>
                                        <xsl:text>E-Posta: </xsl:text>
                                        <xsl:value-of select="."/>
                                      </td>
                                    </tr>
                                  </xsl:for-each>

                                  <xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cac:TaxScheme/cbc:Name">
                                    <tr align="left">
                                      <td>
                                        <span>
                                          <xsl:text>Vergi Dairesi: </xsl:text>
                                          <xsl:value-of select="."/>
                                        </span>
                                      </td>
                                    </tr>
                                  </xsl:for-each>

                                  <xsl:for-each select="n1:Invoice">
                                    <xsl:for-each select="cac:AccountingCustomerParty">
                                      <xsl:for-each select="cac:Party">
                                        <xsl:for-each select="cac:Contact">
                                          <xsl:if test="cbc:Telephone or cbc:Telefax">
                                            <tr align="left">
                                              <td style="width:469px; " align="left">
                                                <xsl:for-each select="cbc:Telephone">
                                                  <span>
                                                    <xsl:text>Tel: </xsl:text>
                                                  </span>
                                                  <xsl:apply-templates/>
                                                </xsl:for-each>
                                                <xsl:for-each select="cbc:Telefax">
                                                  <span>
                                                    <xsl:text> Fax: </xsl:text>
                                                  </span>
                                                  <xsl:apply-templates/>
                                                </xsl:for-each>
                                                <span>
                                                  <xsl:text>&#160;</xsl:text>
                                                </span>
                                              </td>
                                            </tr>
                                          </xsl:if>
                                          <!--<xsl:if test="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cac:TaxScheme/cbc:Name">
                                        <tr align="left">
                                          <td>
                                            <span>
                                              <xsl:text>Vergi Dairesi: </xsl:text>
                                              <xsl:value-of select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cac:TaxScheme/cbc:Name"/>
                                            </span>
                                          </td>
                                        </tr>
                                      </xsl:if>-->
                                        </xsl:for-each>
                                      </xsl:for-each>
                                    </xsl:for-each>
                                  </xsl:for-each>
                                  <!--<xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification">
                                    <tr align="left">
                                      <td>
                                        <xsl:if test="cbc:ID/@schemeID = 'MUSTERINO' ">
                                        <xsl:text>MÃ¼Återi Kodu</xsl:text>  
                                        <xsl:text>: </xsl:text>
                                        <xsl:value-of select="cbc:ID"/>
                                        </xsl:if>
                                        
                                         <xsl:if test="cbc:ID/@schemeID = 'DISTRIBUTORNO' ">
                                        <xsl:text>Ä°lgili</xsl:text>  
                                        <xsl:text>: </xsl:text>
                                        <xsl:value-of select="cbc:ID"/>
                                        </xsl:if>
                                        
                                         <xsl:if test="cbc:ID/@schemeID = 'BAYINO' ">
                                        <xsl:text>BÃ¶lge</xsl:text>  
                                        <xsl:text>: </xsl:text>
                                        <xsl:value-of select="cbc:ID"/>
                                        </xsl:if>
                                        
                                          <xsl:if test="cbc:ID/@schemeID = 'VKN' ">
                                        <xsl:text>VKN</xsl:text>  
                                        <xsl:text>: </xsl:text>
                                        <xsl:value-of select="cbc:ID"/>
                                        </xsl:if>
                                        
                                           <xsl:if test="cbc:ID/@schemeID = 'TCKN' ">
                                        <xsl:text>TCKN</xsl:text>  
                                        <xsl:text>: </xsl:text>
                                        <xsl:value-of select="cbc:ID"/>
                                        </xsl:if>
                                        
                                        
                                        --><!--<xsl:value-of select="cbc:ID/@schemeID"/>
                                        <xsl:text>: </xsl:text>
                                        <xsl:value-of select="cbc:ID"/>--><!--
                                      </td>
                                    </tr>
                                  </xsl:for-each>-->
                                <xsl:for-each select="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification">
<xsl:if test="cbc:ID != ''">
<tr align="left">
<td>
<xsl:value-of select="cbc:ID/@schemeID"/>
<xsl:text>: </xsl:text>
<xsl:value-of select="cbc:ID"/>
</td>
</tr>
</xsl:if>
</xsl:for-each>
                                </tbody>
                              </table>
                              <hr/>
                            </td>
                          </tr>
												</tbody>
												</table>
												<!--<hr/>-->
												</td>
											</tr>
										</tbody>
									</table>
									<br/>
								</td>
								<td width="60%" align="center" valign="bottom" colspan="2">
									<table border="1" height="13" id="despatchTable">
										<tbody>
                      <tr>
                        <td style="width:105px; " align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>ÃzelleÅtirme No:</xsl:text>
                          </span>
                        </td>
                        <td align="left" style="width=105px">
                          <xsl:for-each select="n1:Invoice">
                            <xsl:for-each select="cbc:CustomizationID">
                              <xsl:apply-templates/>
                            </xsl:for-each>
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Senaryo:</xsl:text>
                          </span>
                        </td>
                        <td align="left" style="width=105px">
                          <xsl:for-each select="n1:Invoice">
                            <xsl:for-each select="cbc:ProfileID">
                              <xsl:apply-templates/>
                            </xsl:for-each>
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Fatura Tipi:</xsl:text>
                          </span>
                        </td>
                        <td align="left" style="width=105px">
                          <xsl:for-each select="n1:Invoice">
                            <xsl:for-each select="cbc:InvoiceTypeCode">
                              <xsl:apply-templates/>
                            </xsl:for-each>
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Fatura No:</xsl:text>
                          </span>
                        </td>
                        <td align="left" style="width=105px">
                          <xsl:for-each select="n1:Invoice">
                            <xsl:for-each select="cbc:ID">
                              <xsl:apply-templates/>
                            </xsl:for-each>
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Fatura Tarihi:</xsl:text>
                          </span>
                        </td>
                        <td align="left" style="width=105px">
                          <xsl:for-each select="n1:Invoice">
                            <xsl:for-each select="cbc:IssueDate">
                              <xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
                            </xsl:for-each>
                          </xsl:for-each>
                        </td>
                      </tr>
                      <xsl:for-each select="n1:Invoice/cac:DespatchDocumentReference">
                        <tr style="height:13px; ">
                          <td align="left">
                            <span style="font-weight:bold; ">
                              <xsl:text>Ä°rsaliye No:</xsl:text>
                            </span>
                            <span>
                              <xsl:text>&#160;</xsl:text>
                            </span>
                          </td>
                          <td align="left" style="width=105px" >
                            <xsl:value-of select="cbc:ID"/>
                          </td>
                        </tr>
                        <tr style="height:13px; ">
                          <td align="left">
                            <span style="font-weight:bold; ">
                              <xsl:text>Ä°rsaliye Tarihi:</xsl:text>
                            </span>
                          </td>
                          <td align="left" style="width=105px">
                            <xsl:for-each select="cbc:IssueDate">
                              <xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
                            </xsl:for-each>
                          </td>
                        </tr>
                      </xsl:for-each>
                      <xsl:if test="//n1:Invoice/cac:OrderReference">
                        <tr style="height:13px">
                          <td align="left">
                            <span style="font-weight:bold; ">
                              <xsl:text>SipariÅ No:</xsl:text>
                            </span>
                          </td>
                          <td align="left" style="width=105px">
                            <xsl:for-each select="n1:Invoice/cac:OrderReference">
                              <xsl:for-each select="cbc:ID">
                                <xsl:apply-templates/>
                              </xsl:for-each>
                            </xsl:for-each>
                          </td>
                        </tr>
                      </xsl:if>
                      <xsl:if test="//n1:Invoice/cac:AdditionalDocumentReference">
                        <xsl:for-each select="n1:Invoice/cac:AdditionalDocumentReference">
                          <xsl:if test="cbc:DocumentType != 'Xslt'">
                            <tr style="height:13px">
                              <td align="left">
                                <span style="font-weight:bold; ">
                                  <xsl:value-of select="cbc:DocumentType"/>
                                  <xsl:text>:</xsl:text>
                                </span>
                              </td>
                              <td align="left" style="width=105px">
                                <xsl:for-each select="cbc:ID">
                                  <xsl:apply-templates/>
                                </xsl:for-each>
                              </td>
                            </tr>
                          </xsl:if>
                        </xsl:for-each>
                      </xsl:if>
                      <xsl:if test="//n1:Invoice/cac:OrderReference/cbc:IssueDate">
                        <tr style="height:13px">
                          <td align="left">
                            <span style="font-weight:bold; ">
                              <xsl:text>SipariÅ Tarihi:</xsl:text>
                            </span>
                          </td>
                          <td align="left" style="width=105px">
                            <xsl:for-each select="n1:Invoice/cac:OrderReference">
                              <xsl:for-each select="cbc:IssueDate">
                                <xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
                              </xsl:for-each>
                            </xsl:for-each>
                          </td>
                        </tr>
                      </xsl:if>
										</tbody>
									</table>
								</td>
							</tr>
							<tr align="left">
								<table id="ettnTable">
									<tr style="height:13px;">
										<td align="left" valign="top">
											<span style="font-weight:bold; ">
												<xsl:text>ETTN:</xsl:text>
											</span>
										</td>
										<td align="left" width="240px">
											<xsl:for-each select="n1:Invoice">
												<xsl:for-each select="cbc:UUID">
												<xsl:apply-templates/>
												</xsl:for-each>
											</xsl:for-each>
										</td>
									</tr>
								</table>
							</tr>
						</tbody>
					</table>
					<div id="lineTableAligner">
						<span>
							<xsl:text>&#160;</xsl:text>
						</span>
					</div>
					<table border="1" id="lineTable" width="800">
						<tbody>
						    <tr id="lineTableTr">
                <td id="lineTableTd" align="center">
                  <span style="font-weight:bold; " align="center">
                    <xsl:text>SÄ±ra</xsl:text>
                  </span>
                </td>
                
                 <!--<td id="lineTableTd">
                  <span style="font-weight:bold; " align="center">
                    <xsl:text>Kod</xsl:text>
                  </span>
                </td>-->
                
                <td id="lineTableTd">
                  <span style="font-weight:bold; " align="center">
                    <xsl:text>Malzeme</xsl:text>
                  </span>
                </td>
                  
                <td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>Miktar</xsl:text>
                  </span>
                </td>
                <td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>Birim</xsl:text>
                  </span>
                </td>
                
                <!--<td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>PSF</xsl:text>
                  </span>
                </td>-->
                
                <td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>Birim Fiyat</xsl:text>
                  </span>
                </td>
                
				        <!--<td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>Ä°skonto</xsl:text>
                  </span>
                </td>-->
                
                <td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>Ä°skonto OranÄ±</xsl:text>
                  </span>
                </td>
                <td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>Ä°skonto TutarÄ±</xsl:text>
                  </span>
                </td>
                <td id="lineTableTd" align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>KDV OranÄ±</xsl:text>
                  </span>
                </td>
                <td id="lineTableTd" style="width:82px; " align="center">
                  <span style="font-weight:bold; ">
                    <xsl:text>Tutar</xsl:text>
                  </span>
                </td>
              </tr>
							<!--<xsl:if test="count(//n1:Invoice/cac:InvoiceLine) &gt;= 20">
								<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
									<xsl:apply-templates select="."/>
								</xsl:for-each>
							</xsl:if>
							<xsl:if test="count(//n1:Invoice/cac:InvoiceLine) &lt; 20">
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[1]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[1]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[2]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[2]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[3]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[3]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[4]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[4]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[5]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[5]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[6]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[6]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[7]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[7]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[8]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[8]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[9]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[9]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[10]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[10]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[11]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[11]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[12]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[12]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[13]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[13]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[14]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[14]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[15]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[15]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[16]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[16]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[17]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[17]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[18]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[18]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[19]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[19]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[20]">
										<xsl:apply-templates
											select="//n1:Invoice/cac:InvoiceLine[20]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:if>-->
						</tbody>
           <xsl:apply-templates select="//n1:Invoice/cac:InvoiceLine"/>
					</table>
				</xsl:for-each>
							<table id="budgetContainerTable" width="800px">
				   <tr id="budgetContainerTr" align="right">
            <td id="budgetContainerDummyTd"/>
            <td id="lineTableBudgetTd" align="right" width="200px">
              <span style="font-weight:bold; ">
                <xsl:text>Ara Toplam</xsl:text>
              </span>
            </td>
            <td id="lineTableBudgetTd" style="width:81px; " align="right">
              <span>
                <xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount, '###.##0,00', 'european')"/>
                <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID">
                  <xsl:text> </xsl:text>
                  <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID = 'TRY'">
                    <xsl:text>TL</xsl:text>
                  </xsl:if>
                  <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRY'">
                    <xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID"/>
                  </xsl:if>
                </xsl:if>
              </span>
            </td>
          </tr>
          
          <tr id="budgetContainerTr" align="right">
            <td id="budgetContainerDummyTd"/>
            <td id="lineTableBudgetTd" align="right" width="200px">
              <span style="font-weight:bold; ">
                <xsl:text>Toplam Ä°skonto</xsl:text>
              </span>
            </td>
            <td id="lineTableBudgetTd" style="width:81px; " align="right">
              <span>
                <xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount, '###.##0,00', 'european')"/>
                <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID">
                  <xsl:text> </xsl:text>
                  <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID = 'TRY'">
                    <xsl:text>TL</xsl:text>
                  </xsl:if>
                  <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID != 'TRY'">
                    <xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount/@currencyID"/>
                  </xsl:if>
                </xsl:if>
              </span>
            </td>
          </tr>
          
          <tr id="budgetContainerTr" align="right">
            <td id="budgetContainerDummyTd"/>
            <td id="lineTableBudgetTd" align="right" width="200px">
              <span style="font-weight:bold; ">
                <xsl:text>Net Toplam</xsl:text>
              </span>
            </td>
            <td id="lineTableBudgetTd" style="width:81px; " align="right">
              <span>
                <xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount, '###.##0,00', 'european')"/>
                <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount/@currencyID">
                  <xsl:text> </xsl:text>
                  <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount/@currencyID = 'TRY'">
                    <xsl:text>TL</xsl:text>
                  </xsl:if>
                  <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount/@currencyID != 'TRY'">
                    <xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount/@currencyID"/>
                  </xsl:if>
                </xsl:if>
              </span>
            </td>
          </tr>

          <xsl:for-each select="n1:Invoice">
            <xsl:for-each select="cac:TaxTotal">
              <xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
                <xsl:if test="cbc:TaxTypeCode='0015' ">
                  <xsl:text> </xsl:text>
                  <tr id="budgetContainerTr" align="right">
                    <td id="budgetContainerDummyTd"/>
                    <td id="lineTableBudgetTd" width="200px" align="right">
                      <!--<span style="font-weight:bold; ">
                        <xsl:text></xsl:text>
                        <xsl:value-of select="../../cac:TaxCategory/cac:TaxScheme/cbc:Name"/>
                      </span>-->
                      <span style="font-weight:bold; ">
                        <xsl:text>Hesaplanan </xsl:text>
                        <xsl:value-of select="../../cac:TaxCategory/cac:TaxScheme/cbc:Name"/>
                        <xsl:text>(%</xsl:text>
                        <xsl:value-of select="../../cbc:Percent"/>
                        <xsl:text>)</xsl:text>
                      </span>
                    </td>
                    <td id="lineTableBudgetTd" style="width:82px; " align="right">
                      <xsl:value-of select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
                      <xsl:if test="../../cbc:TaxAmount/@currencyID">
                        <xsl:text> </xsl:text>
                        <xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
                          <xsl:text>TL</xsl:text>
                        </xsl:if>
                        <xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
                          <xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
                        </xsl:if>
                      </xsl:if>
                    </td>
                  </tr>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:for-each>
          
          <xsl:for-each select="n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal">
            <tr id="budgetContainerTr" align="right">
              <td id="budgetContainerDummyTd"/>
              <td id="lineTableBudgetTd" width="211px" align="right">
                <span style="font-weight:bold; ">
                  <xsl:text>Hesaplanan KDV Tevkifat</xsl:text>
                  <xsl:text>(%</xsl:text>
                  <xsl:value-of select="cbc:Percent"/>
                  <xsl:text>)</xsl:text>
                </span>
              </td>
              <td id="lineTableBudgetTd" style="width:82px; " align="right">
                <xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
                  <xsl:text> </xsl:text>
                  <xsl:value-of
										select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
                  <xsl:if test="../../cbc:TaxAmount/@currencyID">
                    <xsl:text> </xsl:text>
                    <xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
                      <xsl:text>TL</xsl:text>
                    </xsl:if>
                    <xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
                      <xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </td>
            </tr>
          </xsl:for-each>
          
              
          <tr id="budgetContainerTr" align="right">
            <td id="budgetContainerDummyTd"/>
            <td id="lineTableBudgetTd" width="200px" align="right">
              <span style="font-weight:bold; ">
                <xsl:text>Toplam Tutar</xsl:text>
              </span>
            </td>
            <td id="lineTableBudgetTd" style="width:82px; " align="right">
              <xsl:for-each select="n1:Invoice">
                <xsl:for-each select="cac:LegalMonetaryTotal">
                  <xsl:for-each select="cbc:PayableAmount">
                    <xsl:value-of select="format-number(., '###.##0,00', 'european')"/>
                    <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID">
                      <xsl:text> </xsl:text>
                      <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID = 'TRY'">
                        <xsl:text>TL</xsl:text>
                      </xsl:if>
                      <xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID != 'TRY'">
                        <xsl:value-of select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/@currencyID"/>
                      </xsl:if>
                    </xsl:if>
                  </xsl:for-each>
                </xsl:for-each>
              </xsl:for-each>
            </td>
          </tr>
          
          
          
					<xsl:for-each select="n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal">
						<xsl:if test="//n1:Invoice/cbc:DocumentCurrencyCode != 'TRY' and //n1:Invoice/cbc:DocumentCurrencyCode != 'TRL' and cbc:TaxAmount != ''">
							<tr id="budgetContainerTr" align="right">
								<td id="budgetContainerDummyTd"/>
								<td id="lineTableBudgetTd" width="211px" align="right">
									<span style="font-weight:bold; ">
										<xsl:text>KDV Tevkifat-[</xsl:text>
										<xsl:value-of select="cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode"/>
										<xsl:text>]-</xsl:text>
										<xsl:text>(%</xsl:text>
										<xsl:value-of select="cbc:Percent"/>
										<xsl:text>) (TL)</xsl:text>
									</span>
								</td>
								<td id="lineTableBudgetTd" style="width:82px; " align="right">
									<xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
										<xsl:text> </xsl:text>
										<xsl:value-of select="format-number(../../cbc:TaxAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
										<xsl:text> TL</xsl:text>
									</xsl:for-each>
								</td>
							</tr>
						</xsl:if>
					</xsl:for-each>
          
					<xsl:if test="//n1:Invoice/cbc:DocumentCurrencyCode != 'TRY' and //n1:Invoice/cbc:DocumentCurrencyCode != 'TRL'">
						<tr align="right">
							<td/>
							<td id="lineTableBudgetTd" align="right" width="200px">
								<span style="font-weight:bold; ">
									<xsl:text>Ara Toplam(TL)</xsl:text>
                  <!--Mal Hizmet Toplam TutarÄ±-->
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:81px; " align="right">
								<span>
									<xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
									<xsl:text> TL</xsl:text>
								</span>
							</td>
						</tr>
            
             <tr id="budgetContainerTr" align="right">
            <td id="budgetContainerDummyTd"/>
            <td id="lineTableBudgetTd" align="right" width="200px">
              <span style="font-weight:bold; ">
                <xsl:text>Toplam Ä°skonto(TL)</xsl:text>
              </span>
            </td>
            <td id="lineTableBudgetTd" style="width:81px; " align="right">
              <span>
                <xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
                <xsl:text> TL</xsl:text>
              </span>
            </td>
          </tr>
            
            <tr id="budgetContainerTr" align="right">
            <td id="budgetContainerDummyTd"/>
            <td id="lineTableBudgetTd" align="right" width="200px">
              <span style="font-weight:bold; ">
                <xsl:text>Net Toplam(TL)</xsl:text>
              </span>
            </td>
            <td id="lineTableBudgetTd" style="width:81px; " align="right">
              <span>
                <xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
                <xsl:text> TL</xsl:text>
              </span>
            </td>
          </tr>
            
            <xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
						<xsl:if test="//n1:Invoice/cbc:DocumentCurrencyCode != 'TRY' and //n1:Invoice/cbc:DocumentCurrencyCode != 'TRL'">
							<tr align="right">
								<td/>
								<td id="lineTableBudgetTd" align="right" width="200px">
									<span style="font-weight:bold; ">
										<xsl:text>Hesaplanan </xsl:text>
										<xsl:value-of select="cac:TaxCategory/cac:TaxScheme/cbc:Name"/>
										<xsl:text>(%</xsl:text>
										<xsl:value-of select="cbc:Percent"/>
										<xsl:text>) (TL)</xsl:text>
									</span>
								</td>
								<td id="lineTableBudgetTd" style="width:81px; " align="right">
									<span>
										<xsl:value-of select="format-number(cbc:TaxAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
										<xsl:text> TL</xsl:text>
									</span>
								</td>
							</tr>
						</xsl:if>
					</xsl:for-each>
            
						<!--<tr id="budgetContainerTr" align="right">
							<td/>
							<td id="lineTableBudgetTd" width="200px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Toplam Tutar(TL)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
								<xsl:text> TL</xsl:text>
							</td>
						</tr>-->
						<tr align="right">
							<td/>
							<td id="lineTableBudgetTd" width="200px" align="right">
								<span style="font-weight:bold; ">
									<xsl:text>Toplam Tutar(TL)</xsl:text>
								</span>
							</td>
							<td id="lineTableBudgetTd" style="width:82px; " align="right">
								<xsl:value-of select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
								<xsl:text> TL</xsl:text>
							</td>
						</tr>
					</xsl:if>
          
				</table>
				<br/>
				<table id="notesTable" width="800" align="left" height="100" >
					<tbody>
						<tr align="left">
							<td id="notesTableTd" colspan ="6">
								<xsl:for-each select="//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
									<xsl:if
										test="cbc:Percent=0 and cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;0015&apos;">
										<b>&#160;&#160;&#160;&#160;&#160; Vergi
											Ä°stisna Muafiyet Sebebi: </b>
										<xsl:value-of
											select="cac:TaxCategory/cbc:TaxExemptionReason"/>
										<br/>
									</xsl:if>
								</xsl:for-each>
                <xsl:for-each select="//n1:Invoice/cbc:Note">
                  <b>&#160;&#160;&#160;&#160;&#160; </b>
                  <xsl:value-of select="."/>
                  <br/>
                </xsl:for-each>
								<!--<xsl:if test="//n1:Invoice/cbc:Note">
									<b>&#160;&#160;&#160;&#160;&#160; Not: </b>
									<xsl:value-of select="//n1:Invoice/cbc:Note"/>
									<br/>
								</xsl:if>-->
                <xsl:if test="//n1:Invoice/cac:PaymentMeans/cbc:PaymentDueDate">
									<b>&#160;&#160;&#160;&#160;&#160; Vade:
										 </b>
									<xsl:value-of
										select="//n1:Invoice/cac:PaymentMeans/cbc:PaymentDueDate"/>
									<br/>
								</xsl:if>
								<xsl:if test="//n1:Invoice/cac:PaymentMeans/cbc:InstructionNote">
									<b>&#160;&#160;&#160;&#160;&#160; Ãdeme
										Vadesi: </b>
									<xsl:value-of
										select="//n1:Invoice/cac:PaymentMeans/cbc:InstructionNote"/>
									<br/>
								</xsl:if>
								<xsl:if
									test="//n1:Invoice/cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:PaymentNote">
									<b>&#160;&#160;&#160;&#160;&#160; Hesap
										AÃ§Ä±klamasÄ±: </b>
									<xsl:value-of
										select="//n1:Invoice/cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:PaymentNote"/>
									<br/>
								</xsl:if>
								<!--<xsl:if test="//n1:Invoice/cac:PaymentTerms/cbc:Note">
									<b>&#160;&#160;&#160;&#160;&#160; Ãdeme
										KoÅulu: </b>
									<xsl:value-of select="//n1:Invoice/cac:PaymentTerms/cbc:Note"/>
									<br/>
								</xsl:if>-->
                <!--<hr/>
                <br/>
                Vade aÅÄ±mÄ±nda AylÄ±k %2 vade farkÄ± uygulanÄ±r.
                <br/>
                <br/>
                <b>
                Banka Hesap Bilgisi:
                </b>
                <br/>
                T.C. Ziraat BankasÄ± IBAN No: TR04 0001 0019 3236 5529 6950 05
                <br/>
                TÃ¼rk Ekonomi BankasÄ± IBAN No: TR38 0003 2000 0000 0041 3462 63
                <br/>
                <br/>
                T.T.K.23.maddesi gereÄince iÅ bu Fatura muhteviyatÄ±na ve fiyatlarÄ±na, ibrazÄ±ndan itibaren 8(sekiz) gÃ¼n iÃ§inde itiraz
edilmediÄi takdirde kabul edilmiÅ sayÄ±lÄ±r.
                <br/>
                <br/>
                <b>KG</b>=Kilogram // <b>KS</b>=1000 adet // <b>MS</b>=Milyon adet // <b>SP</b>=Adet bazlÄ± paket // <b>WP</b>= Kilo bazlÄ± paket
                <br/>-->
          <br/>
              <br/>
            <br/>
          
          
              </td>
						</tr>
            <tr align = "left" bgcolor = "#DCDCDC">
              <th colspan = "6">ÅÄ°RKET UNVANIMIZ DEÄÄ°ÅMÄ°ÅTÄ°R. YENÄ° UNVANIMIZ SPIRAX SARCO VALF SANAYÄ° VE TÄ°CARET A.Å.'DÄ°R.</th>
            
             </tr>
            <tr align = "left" bgcolor = "#DCDCDC">
              <th colspan = "6">Ä°Åbu fatura, TTKânin 21/2 mad. gereÄi 8 gÃ¼n iÃ§inde itiraz edilmediÄi takdirde aynen kabul edilmiÅ sayÄ±lÄ±r.</th>
            
             </tr>
            <tr align = "left" bgcolor = "#DCDCDC">
              <th colspan = "6">Vade tarihine kadar Ã¶denmeyen fatura bedelleri iÃ§in aylÄ±k %3 gecikme faizi uygulanÄ±r.</th>
            
             </tr>
          <tr align = "left" bgcolor = "#FF0000">
              <th>
                <font color ="#FFFFFF">BANKALAR</font>
              </th>
            <th>
                <font color ="#FFFFFF">ÅUBE ADI</font>
              </th>
            <th>
                <font color ="#FFFFFF">ÅUBE KODU</font>
              </th>
            <th>
                <font color ="#FFFFFF">PARA</font>
              </th>
              <!--<th>
                <font color ="#FFFFFF">HESAP NO</font>
              </th>-->
              <th>
                <font color ="#FFFFFF">SWIFT KODU</font>
              </th>
              <th>
                <font color ="#FFFFFF">IBAN NO</font>
              </th>
              <!--<th>
                <font color ="#FFFFFF">EURO IBAN NO</font>
              </th>
              <th>
                <font color ="#FFFFFF">SWIFT KODU</font>
              </th>-->
            </tr>
            <tr align = "left" style="outline: thin solid">
              <td>T. Ä°Å BankasÄ± A.Å.</td>
              <td>KozyataÄÄ± Ticari Åubesi</td>
              <td>1386</td>
              <td>TRY</td>
              <td>ISBKTRIS</td>
              <td>TR770006400000113860004110</td>
            </tr>
            <tr align = "left"  style="outline: thin solid">
              <td>T. Ä°Å BankasÄ± A.Å.</td>
              <td>KozyataÄÄ± Ticari Åubesi</td>
              <td>1386</td>
              <td>EUR</td>
              <td>ISBKTRIS</td>
              <td>TR250006400000213860003101</td>
            </tr>
            <tr align = "left"  style="outline: thin solid">
              <td>T. Ä°Å BankasÄ± A.Å.</td>
              <td>KozyataÄÄ± Ticari Åubesi</td>
              <td>1386</td>
              <td>USD</td>
              <td>ISBKTRIS</td>
              <td>TR080006400000213860003116</td>
            </tr>
            <tr align = "left" style="outline: thin solid">
              <td>T. Ä°Å BankasÄ± A.Å.</td>
              <td>KozyataÄÄ± Ticari Åubesi</td>
              <td>1386</td>
              <td>GBP</td>
              <td>ISBKTRIS</td>
              <td>TR090006400000213860003098</td>
            </tr>
            <tr align = "left" style="outline: thin solid">
              <td>T. Garanti BankasÄ± A.Å.</td>
              <td>Ä°mes Ticari Åubesi</td>
              <td>1616</td>
              <td>TRY</td>
              <td>TGBATRIS</td>
              <td>TR030006200161600006296326</td>
            </tr>
            <tr align = "left" style="outline: thin solid">
              <td>T. Garanti BankasÄ± A.Å.</td>
              <td>Ä°mes Ticari Åubesi</td>
              <td>1616</td>
              <td>EUR</td>
              <td>TGBATRIS</td>
              <td>TR200006200161600009093500</td>
            </tr>
            <tr align = "left" style="outline: thin solid">
              <td>T. Garanti BankasÄ± A.Å.</td>
              <td>Ä°mes Ticari Åubesi</td>
              <td>1616</td>
              <td>USD</td>
              <td>TGBATRIS</td>
              <td>TR630006200161600009093502</td>
            </tr>
            <tr align = "left" style="outline: thin solid">
              <td>T. Garanti BankasÄ± A.Å.</td>
              <td>Ä°mes Ticari Åubesi</td>
              <td>1616</td>
              <td>GBP</td>
              <td>TGBATRIS</td>
              <td>TR900006200161600009093501</td>
            </tr>
          

          
					</tbody>
				</table>
      <table style="width:800px;">
					<tbody>
						<tr>
							<td style="font-weight: bold; font-size: 12px; text-align:right;padding-top:10px;">e-Fatura izni kapsamÄ±nda elektronik ortamda iletilmiÅtir.</td>
						</tr>
					</tbody>
				</table>
				<br/>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="dateFormatter">
    <xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
  </xsl:template>
  <xsl:template match="//n1:Invoice/cac:InvoiceLine">
    <tr id="lineTableTr">
      <td id="lineTableTd">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="./cbc:ID"/>
        </span>
      </td>
      
       <!--<td id="lineTableTd" align ="left">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="./cac:Item/cbc:Description"/>
        </span>
      </td>-->

      <td id="lineTableTd" align ="left">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="./cac:Item/cbc:Name"/>
        </span>
        <xsl:if test="./cac:Item/cbc:ModelName != '' ">
              <br/>
              <br/>
            </xsl:if>
       
        <span style="font-size:9px;">
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="./cac:Item/cbc:ModelName"/>
        
        </span>
      </td>
        
     

      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="format-number(./cbc:InvoicedQuantity, '###.###,##', 'european')"/>          
        </span>
      </td>

      <td id="lineTableTd" align="center">
        <span>
          <xsl:text>&#160;</xsl:text>          
          <xsl:if test="./cbc:InvoicedQuantity/@unitCode">
            <xsl:for-each select="./cbc:InvoicedQuantity">
              <xsl:text> </xsl:text>
              <xsl:choose>
                <xsl:when test="@unitCode  = 'CR'">
                  <span>
                    <xsl:text>KL</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = '26'">
                  <span>
                    <xsl:text>Ton</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'BX'">
                  <span>
                    <xsl:text>Kutu</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'NIU'">
                  <span>
                    <xsl:text>Adet</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'KGM'">
                  <span>
                    <xsl:text>KG</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'KJO'">
                  <span>
                    <xsl:text>kJ</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'GRM'">
                  <span>
                    <xsl:text>G</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MGM'">
                  <span>
                    <xsl:text>MG</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'NT'">
                  <span>
                    <xsl:text>Net Ton</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'GT'">
                  <span>
                    <xsl:text>GT</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MTR'">
                  <span>
                    <xsl:text>M</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MMT'">
                  <span>
                    <xsl:text>MM</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'KTM'">
                  <span>
                    <xsl:text>KM</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MLT'">
                  <span>
                    <xsl:text>ML</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MMQ'">
                  <span>
                    <xsl:text>MM3</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'CLT'">
                  <span>
                    <xsl:text>CL</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'CMK'">
                  <span>
                    <xsl:text>CM2</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'CMQ'">
                  <span>
                    <xsl:text>CM3</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'CMT'">
                  <span>
                    <xsl:text>CM</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MTK'">
                  <span>
                    <xsl:text>M2</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MTQ'">
                  <span>
                    <xsl:text>M3</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'DAY'">
                  <span>
                    <xsl:text> GÃ¼n</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'MON'">
                  <span>
                    <xsl:text> Ay</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'PA'">
                  <span>
                    <xsl:text> Paket</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'DZN'">
                  <span>
                    <xsl:text> Dz</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'KWH'">
                  <span>
                    <xsl:text> KWH</xsl:text>
                  </span>
                </xsl:when>
                <xsl:when test="@unitCode  = 'PK'">
                  <span>
                    <xsl:text> Paket</xsl:text>
                  </span>
                </xsl:when>
              </xsl:choose>
            </xsl:for-each>
          </xsl:if>
        </span>
      </td>

      <!--<td id="lineTableTd" align="center">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="./cac:Item/cbc:Description"/>
        </span>
      </td>-->
      
      <td id="lineTableTd" align="left">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="format-number(./cac:Price/cbc:PriceAmount, '###.##0,00#####', 'european')"/>
          <!--<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID">
            <xsl:text> </xsl:text>
            <xsl:if test='./cac:Price/cbc:PriceAmount/@currencyID = "TRY" '>
              <xsl:text>TL</xsl:text>
            </xsl:if>
            <xsl:if test='./cac:Price/cbc:PriceAmount/@currencyID != "TRY"'>
              <xsl:value-of select="./cac:Price/cbc:PriceAmount/@currencyID"/>
            </xsl:if>
          </xsl:if>-->
        </span>
      </td>
      
      
      
      <!--<td id="lineTableTd" align="left">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="./cbc:Note"/>
        </span>
      </td>-->
      
      <td id="lineTableTd" align="right">
                                                               <span>
                                                                              <xsl:text>&#160;</xsl:text>
                                                                              <xsl:if test="./cac:AllowanceCharge/cbc:MultiplierFactorNumeric">
                                                                                              <xsl:text> %</xsl:text>
                                                                                              <xsl:value-of
                                                                                                              select="format-number(./cac:AllowanceCharge/cbc:MultiplierFactorNumeric, '###.##0,00', 'european')"
                                                                                              />
                                                                              </xsl:if>
                                                               </span>
      </td>

      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:if test="./cac:AllowanceCharge">
          <!--  <xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = true() ">+
										</xsl:if>
						<xsl:if test="./cac:AllowanceCharge/cbc:ChargeIndicator = false() ">-
										</xsl:if>--> 
            <xsl:value-of select="format-number(./cac:AllowanceCharge/cbc:Amount, '###.##0,00', 'european')"/>
          </xsl:if>
           <xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID">
            <xsl:text> </xsl:text>
            <xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID = 'TRL'  or ./cac:AllowanceCharge/cbc:Amount/@currencyID = 'TRY'">
              <xsl:text>TL</xsl:text>
            </xsl:if>
            <xsl:if test="./cac:AllowanceCharge/cbc:Amount/@currencyID != 'TRL' and ./cac:AllowanceCharge/cbc:Amount/@currencyID != 'TRY'">
              <xsl:value-of select="./cac:AllowanceCharge/cbc:Amount/@currencyID"/>
            </xsl:if>
          </xsl:if> 
        </span>
      </td>
      <td id="lineTableTd" align="center">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:for-each select="./cac:TaxTotal">
            <xsl:for-each select="cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
              <xsl:if test="cbc:TaxTypeCode='0015' ">
                <xsl:if test="../../cbc:Percent>0 ">
                  <xsl:text> %</xsl:text>
                  <xsl:value-of select="../../cbc:Percent"/>
                </xsl:if>
              </xsl:if>
            </xsl:for-each>
          </xsl:for-each>
        </span>
      </td>

      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
          <xsl:value-of select="format-number(./cbc:LineExtensionAmount, '###.##0,00', 'european')"/>
          <xsl:if test="./cbc:LineExtensionAmount/@currencyID">
            <xsl:text> </xsl:text>
            <xsl:if test="./cbc:LineExtensionAmount/@currencyID = 'TRL'  or ./cbc:LineExtensionAmount/@currencyID = 'TRY'">
              <xsl:text>TL</xsl:text>
            </xsl:if>
            <xsl:if test="./cbc:LineExtensionAmount/@currencyID != 'TRL' and ./cbc:LineExtensionAmount/@currencyID != 'TRY' ">
              <xsl:value-of select="./cbc:LineExtensionAmount/@currencyID"/>
            </xsl:if>
          </xsl:if>
        </span>
      </td>
    </tr>
  </xsl:template>
  <xsl:template match="//n1:Invoice">
    <tr id="lineTableTr">
      <td id="lineTableTd">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <!--<td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>
      <td id="lineTableTd" align="right">
        <span>
          <xsl:text>&#160;</xsl:text>
        </span>
      </td>-->
    </tr>
  </xsl:template>
  <xsl:template name="Curr_Type">
    <xsl:value-of select="format-number(., '###.##0,00', 'european')"/>
    <xsl:if	test="@currencyID">
      <xsl:text> </xsl:text>
      <xsl:choose>
        <xsl:when test="@currencyID = 'TRL' or @currencyID = 'TRY'">
          <xsl:text>TL</xsl:text>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="@currencyID"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
