<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  
  <xsl:template match="/">
    <Skills>
      <xsl:apply-templates select="/dir/dir[@name='skill']/dir"/>
    </Skills>
  </xsl:template>
  
  <xsl:template match="/dir/dir[@name='skill']/dir">
    <xsl:element name="Skill">
      <xsl:attribute name="id">
        <xsl:value-of select="@name"/>
      </xsl:attribute>
      <attr>
        <xsl:copy-of select="./dir[@name='common']/*"/>
      </attr>
      <info>
        <xsl:copy-of select="./dir[@name='info']/*"/>
        <xsl:if test="./string[@name='bgm']">
          <xsl:copy-of select="./string[@name='bgm']"/>
        </xsl:if>
      </info>
      <xsl:copy-of select="./int" />
      <xsl:copy-of select="./int32" />
      <xsl:copy-of select="./int64" />
      <xsl:copy-of select="./string[@name='elemAttr']"/>
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>
